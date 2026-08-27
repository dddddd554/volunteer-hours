import "@testing-library/jest-dom/vitest";
import { ExternalBlob } from "@caffeineai/object-storage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Activity } from "../backend";
import { useActivities, useAddActivity } from "../hooks/useQueries";

// The hooks call the backend actor's public methods. Provide a typed local
// actor mock so the API-consumer contract is asserted without a real canister.
const mockActor = vi.hoisted(() => ({
  listActivities: vi.fn(),
  addActivity: vi.fn(),
}));

// @caffeineai/object-storage ships extensionless ESM imports that Node's ESM
// resolver rejects; stub it so the generated backend bindings can load.
vi.mock("@caffeineai/object-storage", () => ({
  ExternalBlob: { fromURL: (url: string) => ({ url }) },
  StorageClient: class {
    async putFile() {
      return { hash: "mock" };
    }
    async getDirectURL() {
      return "https://mock";
    }
  },
}));

// useActor normally builds the actor from config; replace it with the mock so
// the hooks exercise their own query/mutation logic against a known actor.
// The real package also ships extensionless ESM imports, so it is stubbed
// wholesale rather than loaded and spread.
vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: () => ({ actor: mockActor, isFetching: false }),
}));

function makeActivity(overrides: Partial<Activity>): Activity {
  return {
    id: 1n,
    title: "Food Bank Sorting",
    hours: 2n,
    date: "Aug 27",
    createdAt: 1n,
    filename: "evidence.jpg",
    image: ExternalBlob.fromURL("https://mock"),
    ...overrides,
  };
}

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

afterEach(() => {
  vi.clearAllMocks();
});

describe("useQueries hooks (backend consumer contract)", () => {
  it("useActivities reads the saved activities from listActivities", async () => {
    mockActor.listActivities.mockResolvedValue([
      makeActivity({ title: "Food Bank Sorting", hours: 2n }),
    ]);

    const { result } = renderHook(() => useActivities(), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.data).toHaveLength(1));
    expect(mockActor.listActivities).toHaveBeenCalledTimes(1);
    expect(result.current.data?.[0]).toMatchObject({
      title: "Food Bank Sorting",
      hours: 2n,
    });
  });

  it("useAddActivity calls addActivity with the submitted input", async () => {
    mockActor.addActivity.mockResolvedValue(
      makeActivity({ title: "Park Cleanup", hours: 4n }),
    );

    const { result } = renderHook(() => useAddActivity(), {
      wrapper: makeWrapper(),
    });

    result.current.mutate({
      title: "Park Cleanup",
      hours: 4n,
      date: "Aug 28",
      image: ExternalBlob.fromURL("https://mock"),
      filename: "evidence.jpg",
    });

    await waitFor(() => expect(mockActor.addActivity).toHaveBeenCalledTimes(1));
    expect(mockActor.addActivity).toHaveBeenCalledWith(
      "Park Cleanup",
      4n,
      "Aug 28",
      ExternalBlob.fromURL("https://mock"),
      "evidence.jpg",
    );
  });
});
