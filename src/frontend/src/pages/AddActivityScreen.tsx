import { ExternalBlob } from "@caffeineai/object-storage";
import { Camera, CheckCircle2, ImagePlus, RefreshCw, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ScreenShell } from "../components/ScreenShell";
import { useCamera } from "../hooks/useCamera";
import { useImageUpload } from "../hooks/useImageUpload";
import type { UploadedImage } from "../hooks/useImageUpload";
import { useAddActivity } from "../hooks/useQueries";
import type { View } from "../types/view";

type Props = {
  activeView: View;
  onNavigate: (view: View) => void;
  pendingPhoto: UploadedImage | null;
  onConsumePhoto: () => void;
};

function formatToday(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function AddActivityScreen({
  activeView,
  onNavigate,
  pendingPhoto,
  onConsumePhoto,
}: Props) {
  const [title, setTitle] = useState("");
  const [hours, setHours] = useState("");
  const [imageError, setImageError] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending, isSuccess, reset } = useAddActivity();
  const {
    image,
    progress,
    isUploading,
    error: uploadError,
    upload,
    reset: resetImage,
  } = useImageUpload();

  // The photo captured on the Scan tab is carried into this form via shared
  // state. Prefer any image uploaded here, otherwise fall back to the pending
  // photo so the user can complete and save the activity with it.
  const effectiveImage = image ?? pendingPhoto;

  const {
    isActive,
    error: cameraError,
    isLoading: cameraLoading,
    startCamera,
    stopCamera,
    capturePhoto,
    videoRef,
    canvasRef,
  } = useCamera({ facingMode: "environment", format: "image/jpeg" });

  // Stop the camera stream when the screen unmounts or the camera is closed.
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const handleOpenCamera = async () => {
    setImageError(null);
    setCameraOpen(true);
    await startCamera();
  };

  const handleCloseCamera = () => {
    stopCamera();
    setCameraOpen(false);
  };

  const handleCapture = async () => {
    const file = await capturePhoto();
    if (file) {
      const uploaded = await upload(file);
      if (uploaded) {
        setImageError(null);
      }
      handleCloseCamera();
    }
  };

  const handlePickFromGallery = () => {
    setImageError(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const uploaded = await upload(file);
      if (uploaded) {
        setImageError(null);
      }
    }
    event.target.value = "";
  };

  const handleRemoveImage = () => {
    resetImage();
    onConsumePhoto();
    setImageError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !hours.trim()) return;

    if (!effectiveImage) {
      setImageError("กรุณาเพิ่มรูปหลักฐานก่อนบันทึกกิจกรรม");
      return;
    }

    mutate({
      title: title.trim(),
      hours: BigInt(Math.round(Number(hours))),
      date: formatToday(),
      image: effectiveImage.blob,
      filename: effectiveImage.filename,
    });
    onConsumePhoto();
  };

  const handleAddAnother = () => {
    reset();
    resetImage();
    onConsumePhoto();
    setTitle("");
    setHours("");
    setImageError(null);
  };

  const showImageError = imageError || uploadError;

  return (
    <ScreenShell activeView={activeView} onNavigate={onNavigate}>
      <header className="mt-4">
        <h1 className="font-display text-[34px] font-bold leading-tight tracking-tight text-foreground">
          Add Activity
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Log a new volunteer session
        </p>
      </header>

      <main className="mt-6 flex flex-1 flex-col">
        {isSuccess ? (
          <div
            data-ocid="add_activity.success"
            className="flex flex-1 flex-col items-center justify-center gap-4 text-center"
          >
            <CheckCircle2
              className="h-16 w-16 text-success"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <p className="font-display text-xl font-bold text-foreground">
              Activity logged!
            </p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Your volunteer hours have been recorded. Keep up the great work!
            </p>
            <button
              type="button"
              data-ocid="add_activity.add_another_button"
              onClick={handleAddAnother}
              className="mt-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-subtle transition-smooth hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Add another
            </button>
          </div>
        ) : (
          <form
            data-ocid="add_activity.form"
            onSubmit={handleSubmit}
            className="flex flex-1 flex-col gap-5"
          >
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-foreground">
                Activity name
              </span>
              <input
                data-ocid="add_activity.input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Food Bank Sorting"
                className="rounded-2xl border border-input bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-foreground">
                Hours
              </span>
              <input
                data-ocid="add_activity.hours_input"
                type="number"
                min="0"
                step="1"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="e.g. 2"
                className="rounded-2xl border border-input bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>

            {/* ===== Required photo evidence ===== */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-foreground">
                Photo evidence <span className="text-destructive">*</span>
              </span>

              {effectiveImage ? (
                <div
                  data-ocid="add_activity.photo_preview"
                  className="photo-frame"
                >
                  <img
                    src={effectiveImage.blob.getDirectURL()}
                    alt="หลักฐานการทำกิจกรรม"
                  />
                  <button
                    type="button"
                    data-ocid="add_activity.remove_photo_button"
                    onClick={handleRemoveImage}
                    aria-label="ลบรูปหลักฐาน"
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white shadow-subtle transition-smooth hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              ) : cameraOpen ? (
                <div
                  data-ocid="add_activity.camera"
                  className="viewfinder flex flex-col"
                >
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    className="h-full w-full object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />

                  {cameraError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 p-4 text-center">
                      <p className="text-sm text-white">
                        {cameraError.message}
                      </p>
                      <button
                        type="button"
                        data-ocid="add_activity.camera_retry_button"
                        onClick={startCamera}
                        className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-smooth hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <RefreshCw className="h-4 w-4" aria-hidden="true" />
                        ลองอีกครั้ง
                      </button>
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-3 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <button
                      type="button"
                      data-ocid="add_activity.capture_button"
                      onClick={handleCapture}
                      disabled={!isActive || cameraLoading}
                      aria-label="ถ่ายรูป"
                      className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-white/20 transition-smooth hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span className="h-10 w-10 rounded-full bg-white" />
                    </button>
                    <button
                      type="button"
                      data-ocid="add_activity.camera_close_button"
                      onClick={handleCloseCamera}
                      aria-label="ปิดกล้อง"
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition-smooth hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  data-ocid="add_activity.photo_drop"
                  onClick={handleOpenCamera}
                  className="photo-drop w-full flex-col gap-3 text-center"
                >
                  <ImagePlus
                    className="h-9 w-9 text-primary/60"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <span className="text-sm font-semibold text-foreground">
                    เพิ่มรูปหลักฐาน
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ถ่ายด้วยกล้องหรือเลือกจากคลังมือถือ
                  </span>
                </button>
              )}

              {/* Action row: gallery picker + camera toggle */}
              {!effectiveImage && !cameraOpen && (
                <div className="flex gap-3">
                  <button
                    type="button"
                    data-ocid="add_activity.gallery_button"
                    onClick={handlePickFromGallery}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full border border-input bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-smooth hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <ImagePlus className="h-4 w-4" aria-hidden="true" />
                    เลือกจากคลัง
                  </button>
                  <button
                    type="button"
                    data-ocid="add_activity.camera_button"
                    onClick={handleOpenCamera}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full border border-input bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-smooth hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Camera className="h-4 w-4" aria-hidden="true" />
                    ถ่ายด้วยกล้อง
                  </button>
                </div>
              )}

              {/* Upload progress */}
              {isUploading && (
                <div
                  data-ocid="add_activity.upload_progress"
                  className="flex items-center gap-3"
                >
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${progress ?? 0}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {progress ?? 0}%
                  </span>
                </div>
              )}

              {/* Required-image validation error */}
              {showImageError && (
                <p
                  data-ocid="add_activity.photo_error"
                  role="alert"
                  className="text-sm font-medium text-destructive"
                >
                  {showImageError}
                </p>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              data-ocid="add_activity.gallery_input"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              type="submit"
              data-ocid="add_activity.submit_button"
              disabled={isPending || isUploading}
              className="mt-auto rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-subtle transition-smooth hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Logging…" : "Log activity"}
            </button>
          </form>
        )}
      </main>
    </ScreenShell>
  );
}
