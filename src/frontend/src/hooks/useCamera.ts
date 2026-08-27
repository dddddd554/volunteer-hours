import { useCamera as useCameraBase } from "@caffeineai/camera";
import type { CameraConfig } from "@caffeineai/camera";

export type { CameraConfig, CameraError } from "@caffeineai/camera";

/**
 * Wrapper around @caffeineai/camera's useCamera hook for capturing photo
 * evidence from the device camera. Exposes the same API so pages can capture
 * a photo (returning a File) and hand it to useImageUpload for cloud storage.
 */
export function useCamera(config?: CameraConfig) {
  return useCameraBase(config);
}
