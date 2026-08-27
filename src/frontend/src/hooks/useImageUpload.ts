import { ExternalBlob } from "@caffeineai/object-storage";
import { useCallback, useState } from "react";

export type UploadedImage = {
  blob: ExternalBlob;
  filename: string;
};

export type UseImageUploadReturn = {
  /** The uploaded image reference, or null when nothing has been uploaded yet. */
  image: UploadedImage | null;
  /** Upload progress as a percentage (0-100), or null when idle. */
  progress: number | null;
  /** Whether an upload is currently in flight. */
  isUploading: boolean;
  /** Error message from the last failed upload, or null. */
  error: string | null;
  /** Convert a File to an ExternalBlob and upload it to the signed-in user's account cloud. */
  upload: (file: File) => Promise<UploadedImage | null>;
  /** Clear the current image and any error/progress state. */
  reset: () => void;
};

/**
 * Converts a browser File into an ExternalBlob and uploads it to the signed-in
 * user's account cloud via the object-storage extension. The returned
 * `{ blob, filename }` pair is passed to the backend so the activity record
 * keeps a reference to the stored image.
 */
export function useImageUpload(): UseImageUploadReturn {
  const [image, setImage] = useState<UploadedImage | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File): Promise<UploadedImage | null> => {
      if (!file) return null;

      setIsUploading(true);
      setError(null);
      setProgress(0);

      try {
        const bytes = new Uint8Array(await file.arrayBuffer());
        const blob = ExternalBlob.fromBytes(
          bytes,
          file.type,
          file.name,
        ).withUploadProgress((pct) => setProgress(pct));

        // Uploading is triggered lazily by the storage gateway when the blob is
        // first referenced. Force the upload to complete now so the image is
        // stored on the user's account cloud before the activity is saved.
        await blob.getBytes();

        const uploaded: UploadedImage = { blob, filename: file.name };
        setImage(uploaded);
        setProgress(100);
        return uploaded;
      } catch (err) {
        const message = err instanceof Error ? err.message : "อัปโหลดรูปไม่สำเร็จ";
        setError(message);
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setImage(null);
    setProgress(null);
    setError(null);
    setIsUploading(false);
  }, []);

  return { image, progress, isUploading, error, upload, reset };
}
