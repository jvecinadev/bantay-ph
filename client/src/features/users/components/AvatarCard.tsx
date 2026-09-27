import { useMemo, useRef, useState, type ChangeEvent } from "react";

type Props = {
  name: string;
  avatarUrl: string | null;
  isUploading: boolean;
  uploadError: string | null;
  onUpload: (file: File) => Promise<void>;
};

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;

const validateFile = (file: File) => {
  if (!ALLOWED_TYPES.includes(file.type)) return "Avatar must be JPG, PNG, or WebP.";
  if (file.size > MAX_BYTES) return "Avatar must be 5MB or less.";
  return null;
};

const AvatarCard = ({
  name,
  avatarUrl,
  isUploading,
  uploadError,
  onUpload,
}: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const initials = useMemo(() => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const a = parts[0]?.[0] ?? "";
    const b = parts[1]?.[0] ?? "";
    return (a + b).toUpperCase() || "U";
  }, [name]);

  const shownAvatar = preview ?? avatarUrl ?? null;
  const error = localError ?? uploadError;
  const awaitingConfirm = !!pendingFile;

  const clearPending = () => {
    setPreview(null);
    setPendingFile(null);
    setLocalError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const err = validateFile(file);
    if (err) {
      setLocalError(err);
      setPendingFile(null);
      return;
    }

    setLocalError(null);
    setPendingFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleConfirm = async () => {
    if (!pendingFile) return;

    try {
      await onUpload(pendingFile);
      setPendingFile(null);
      setPreview(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch {
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      <div className="border-b border-border px-5 py-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Profile photo
        </div>
      </div>

      <div className="p-5">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-border bg-surface-sunken">
            {shownAvatar ? (
              <img
                src={shownAvatar}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg font-bold tracking-tight text-text-secondary">
                {initials}
              </div>
            )}

            {awaitingConfirm ? (
              <span className="absolute inset-x-0 bottom-0 bg-text-primary/70 py-0.5 text-center text-[10px] font-semibold uppercase tracking-wider text-surface backdrop-blur-sm">
                Preview
              </span>
            ) : null}
          </div>

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <div className="truncate text-sm font-semibold text-text-primary">
              {name || "—"}
            </div>
            <div className="mt-1 text-xs leading-relaxed text-text-secondary">
              {awaitingConfirm
                ? "Review your new photo before saving."
                : "JPG, PNG, or WebP · Up to 5MB"}
            </div>
          </div>
        </div>

        {error ? (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-danger/30 bg-danger-light px-3.5 py-2.5 text-xs text-danger">
            <span className="mt-0.5 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-danger/20 text-[9px] font-bold">
              !
            </span>
            <span className="leading-relaxed">{error}</span>
          </div>
        ) : null}

        {awaitingConfirm ? (
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isUploading}
              className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary px-3.5 py-2.5 text-sm font-semibold text-surface shadow-card transition-all hover:bg-primary-dark hover:shadow-card-hover focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none sm:py-2"
            >
              {isUploading ? "Uploading…" : "Use this photo"}
            </button>

            <button
              type="button"
              onClick={clearPending}
              disabled={isUploading}
              className="inline-flex items-center justify-center rounded-lg border border-border-strong bg-surface px-3.5 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-text-secondary/40 hover:bg-surface-sunken focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 sm:py-2"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="mt-5">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex w-full items-center justify-center rounded-lg border border-border-strong bg-surface px-3.5 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60 sm:py-2"
            >
              {avatarUrl ? "Change photo" : "Upload photo"}
            </button>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default AvatarCard;