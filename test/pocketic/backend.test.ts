import { PocketIc, createIdentity } from "@dfinity/pic";
import { afterAll, beforeAll, expect, it } from "vitest";

import { idlFactory } from "../../src/frontend/src/declarations/backend.did.js";
import type { _SERVICE } from "../../src/frontend/src/declarations/backend.did";

const PIC_URL = process.env.POCKET_IC_URL ?? "";
const BACKEND_WASM = process.env.BACKEND_WASM ?? "";

let pic: PocketIc | undefined;
let actor: _SERVICE;

beforeAll(async () => {
  pic = await PocketIc.create(PIC_URL);
  ({ actor } = await pic.setupCanister<_SERVICE>({
    idlFactory,
    wasm: BACKEND_WASM,
  }));
});

afterAll(async () => {
  // `?.` because `beforeAll` may not have got that far. A failed
  // `PocketIc.create` otherwise stacks "Cannot read properties of undefined"
  // on top of the real error and buries the one line that explains the run.
  await pic?.tearDown();
});

it("answers an empty-state read instead of trapping", async () => {
  // addActivity/listActivities require an authenticated (non-anonymous)
  // caller; use a real identity so the empty-state read is exercised.
  actor.setIdentity(createIdentity("empty-state-seed"));
  await expect(actor.listActivities()).resolves.toEqual([]);
});

it("round-trips an activity through the real canister", async () => {
  actor.setIdentity(createIdentity("round-trip-seed"));
  const activity = await actor.addActivity("Food Bank Sorting", 2n, "Aug 27");
  expect(activity).toMatchObject({
    title: "Food Bank Sorting",
    hours: 2n,
    date: "Aug 27",
  });
  expect(await actor.listActivities()).toContainEqual(
    expect.objectContaining({ id: activity.id, title: "Food Bank Sorting" }),
  );
});

it("does not show one caller's activities to another", async () => {
  const alice = createIdentity("alice-seed");
  const bob = createIdentity("bob-seed");

  actor.setIdentity(alice);
  await actor.addActivity("Alice's private activity", 1n, "Aug 27");

  actor.setIdentity(bob);
  expect(await actor.listActivities()).toEqual([]);

  actor.setIdentity(alice);
  expect(await actor.listActivities()).toContainEqual(
    expect.objectContaining({ title: "Alice's private activity" }),
  );
});

it("exposes the caller's activities through OQL execute", async () => {
  const alice = createIdentity("alice-seed");
  actor.setIdentity(alice);
  await actor.addActivity("OQL visible activity", 3n, "Aug 28");

  const result = await actor.execute(
    JSON.stringify({ start: "activity" }),
  );
  expect(result.hasMore).toBe(false);
  const titles = result.rows.map((row) =>
    row.find((cell) => cell.name === "title")?.value,
  );
  expect(titles).toContainEqual({ text: "OQL visible activity" });
});
