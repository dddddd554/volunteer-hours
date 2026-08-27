import {
  Camera,
  CheckCircle2,
  ImagePlus,
  RefreshCw,
  ScanLine,
  SwitchCamera,
  UploadCloud,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ScreenShell } from "../components/ScreenShell";
import { useIsMobile } from "../hooks/use-mobile";
import { useCamera } from "../hooks/useCamera";
import { useImageUpload } from "../hooks/useImageUpload";
import type { UploadedImage } from "../hooks/useImageUpload";
import type { View } from "../types/view";

type Props = {
  activeView: View;
  onNavigate: (view: View) => void;
  onPhotoReady: (photo: UploadedImage) => void;
};

type Stage = "idle" | "camera" | "preview" | "saving" | "success";

export function ScanScreen({ activeView, onNavigate, onPhotoReady }: Props) {
  const isMobile = useIsMobile();
  const {
    isActive,
    isSupported,
    error: cameraError,
    isLoading,
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera,
    retry,
    videoRef,
    canvasRef,
  } = useCamera({ facingMode: "environment" });

  const { progress, error: uploadError, upload, reset } = useImageUpload();

  const [stage, setStage] = useState<Stage>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stop the camera stream when leaving the screen.
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const openCamera = async () => {
    setStage("camera");
    await startCamera();
  };

  const handleCapture = async () => {
    const file = await capturePhoto();
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setStage("preview");
      await stopCamera();
    }
  };

  const handlePickFromGallery = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setStage("preview");
    }
    event.target.value = "";
  };

  const handleSave = async () => {
    if (!previewUrl) return;
    // Reconstruct the File from the preview blob so it can be uploaded.
    const blob = await (await fetch(previewUrl)).blob();
    const file = new File([blob], `evidence-${Date.now()}.jpg`, {
      type: blob.type || "image/jpeg",
    });
    setStage("saving");
    const uploaded = await upload(file);
    if (uploaded) {
      onPhotoReady(uploaded);
      setStage("success");
    } else {
      setStage("preview");
    }
  };

  const handleRetake = () => {
    reset();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setStage("idle");
  };

  const handleProceedToActivity = () => {
    onNavigate("add-activity");
  };

  const renderCameraError = () => {
    if (!cameraError) return null;
    const message =
      cameraError.type === "permission"
        ? "Camera permission was denied. Allow camera access to capture evidence."
        : cameraError.type === "not-supported"
          ? "Camera is not supported in this browser."
          : cameraError.message || "Could not start the camera.";
    return (
      <div
        data-ocid="scan.camera_error"
        className="flex flex-col items-center gap-3 rounded-2xl border border-destructive/40 bg-destructive/5 p-5 text-center"
      >
        <p className="text-sm text-foreground">{message}</p>
        <button
          type="button"
          data-ocid="scan.retry_button"
          onClick={retry}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-subtle transition-smooth hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Try again
        </button>
      </div>
    );
  };

  return (
    <ScreenShell activeView={activeView} onNavigate={onNavigate}>
      <header className="mt-4">
        <h1 className="font-display text-[34px] font-bold leading-tight tracking-tight text-foreground">
          Scan
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Capture photo evidence of your volunteer session
        </p>
      </header>

      <main className="mt-6 flex flex-1 flex-col">
        {stage === "success" ? (
          <div
            data-ocid="scan.success"
            className="flex flex-1 flex-col items-center justify-center gap-4 text-center"
          >
            <CheckCircle2
              className="h-16 w-16 text-success"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <p className="font-display text-xl font-bold text-foreground">
              Photo saved!
            </p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Your evidence photo has been uploaded to your account cloud.
            </p>
            <div className="mt-2 flex w-full max-w-xs flex-col gap-3">
              <button
                type="button"
                data-ocid="scan.add_activity_button"
                onClick={handleProceedToActivity}
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-subtle transition-smooth hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Add activity with this photo
              </button>
              <button
                type="button"
                data-ocid="scan.capture_another_button"
                onClick={handleRetake}
                className="rounded-full border border-input bg-card px-6 py-3 text-sm font-semibold text-foreground transition-smooth hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Capture another
              </button>
            </div>
          </div>
        ) : stage === "camera" ? (
          <div className="flex flex-1 flex-col gap-4">
            <div
              data-ocid="scan.viewfinder"
              className="viewfinder w-full max-w-[340px] self-center"
            >
              <video
                ref={videoRef}
                playsInline
                muted
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="scan-grid pointer-events-none absolute inset-0" />
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-sm text-white/80">Starting camera…</p>
                </div>
              )}
            </div>

            {renderCameraError()}

            <div className="flex items-center justify-center gap-3">
              {isMobile && (
                <button
                  type="button"
                  data-ocid="scan.switch_camera_button"
                  onClick={() => switchCamera()}
                  disabled={!isActive || isLoading}
                  aria-label="Switch camera"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-input bg-card text-foreground shadow-subtle transition-smooth hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <SwitchCamera className="h-5 w-5" aria-hidden="true" />
                </button>
              )}
              <button
                type="button"
                data-ocid="scan.capture_button"
                onClick={handleCapture}
                disabled={!isActive || isLoading}
                aria-label="Take photo"
                className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-subtle transition-smooth hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Camera className="h-7 w-7" aria-hidden="true" />
              </button>
              <button
                type="button"
                data-ocid="scan.cancel_camera_button"
                onClick={() => {
                  stopCamera();
                  setStage("idle");
                }}
                aria-label="Close camera"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-input bg-card text-foreground shadow-subtle transition-smooth hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        ) : stage === "preview" || stage === "saving" ? (
          <div className="flex flex-1 flex-col gap-4">
            <div
              data-ocid="scan.preview"
              className="photo-frame w-full max-w-[340px] self-center"
            >
              {previewUrl && (
                <img src={previewUrl} alt="Captured evidence preview" />
              )}
            </div>

            {uploadError && (
              <div
                data-ocid="scan.upload_error"
                className="rounded-2xl border border-destructive/40 bg-destructive/5 p-4 text-center text-sm text-foreground"
              >
                {uploadError}
              </div>
            )}

            {stage === "saving" && (
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <UploadCloud className="h-4 w-4" aria-hidden="true" />
                  Uploading to your cloud…
                </div>
                <div className="h-2 w-full max-w-[340px] overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${progress ?? 0}%` }}
                  />
                </div>
              </div>
            )}

            <div className="mt-auto flex flex-col gap-3">
              <button
                type="button"
                data-ocid="scan.save_button"
                onClick={handleSave}
                disabled={stage === "saving"}
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-subtle transition-smooth hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
              >
                {stage === "saving" ? "Saving…" : "Save photo"}
              </button>
              <button
                type="button"
                data-ocid="scan.retake_button"
                onClick={handleRetake}
                disabled={stage === "saving"}
                className="rounded-full border border-input bg-card px-6 py-3 text-sm font-semibold text-foreground transition-smooth hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
              >
                Retake
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-6">
            <div
              data-ocid="scan.empty_state"
              className="photo-drop w-full max-w-[340px]"
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <ScanLine
                  className="h-12 w-12 text-primary/50"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <p className="px-6 text-sm text-muted-foreground">
                  Capture or upload a photo as evidence of your volunteer
                  session.
                </p>
              </div>
            </div>

            <div className="flex w-full max-w-[340px] flex-col gap-3">
              <button
                type="button"
                data-ocid="scan.open_camera_button"
                onClick={openCamera}
                disabled={isSupported === false}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-subtle transition-smooth hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Camera className="h-4 w-4" aria-hidden="true" />
                Open camera
              </button>
              <button
                type="button"
                data-ocid="scan.gallery_button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-input bg-card px-6 py-3 text-sm font-semibold text-foreground transition-smooth hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ImagePlus className="h-4 w-4" aria-hidden="true" />
                Choose from gallery
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                data-ocid="scan.gallery_input"
                onChange={handlePickFromGallery}
                className="hidden"
              />
            </div>
          </div>
        )}
      </main>

      <canvas ref={canvasRef} className="hidden" />
    </ScreenShell>
  );
}
