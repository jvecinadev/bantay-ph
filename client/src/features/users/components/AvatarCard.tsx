import { useMemo, useRef, useState } from "react";

type Props = {
  name: string;
  avatarUrl: string | null;
  isUploading: boolean;
  uploadError: string | null;
  onUpload: (file: File) => Promise<void>;
};

const AvatarCard = ({ name, avatarUrl, isUploading, uploadError, onUpload }: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const initials = useMemo(() => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const a = parts[0]?.[0] ?? "";
    const b = parts[1]?.[0] ?? "";
    return (a + b).toUpperCase() || "U";
  }, [name]);

  const shownAvatar = localPreview ?? avatarUrl ?? null;

  const validateFile = (file: File) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) return "Avatar must be JPG, PNG, or WebP.";
    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) return "Avatar must be 5MB or less.";
    return null;
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
      <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
        Profile photo
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="h-16 w-16 overflow-hidden rounded-full border border-border bg-surface-sunken">
          {shownAvatar ? (
            <img src={shownAvatar} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-bold text-text-primary">
              {initials}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-text-primary">{name || "—"}</div>
          <div className="mt-1 text-xs text-text-secondary">
            JPG / PNG / WebP, up to 5MB
          </div>
        </div>
      </div>

      {(localError || uploadError) ? (
        <div className="mt-4 rounded-xl border border-danger/30 bg-danger-light px-4 py-3 text-sm text-danger">
          {(localError ?? uploadError) as string}
        </div>
      ) : null}

      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="inline-flex flex-1 items-center justify-center rounded-xl border border-border-strong bg-surface px-4 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUploading ? "Uploading…" : "Change photo"}
        </button>

        {localPreview ? (
          <button
            type="button"
            onClick={() => {
              setLocalPreview(null);
              setLocalError(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="inline-flex items-center justify-center rounded-xl border border-border-strong bg-surface px-4 py-2.5 text-sm font-semibold text-text-primary hover:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
          >
            Reset
          </button>
        ) : null}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const err = validateFile(file);
            if (err) {
              setLocalError(err);
              return;
            }

            setLocalError(null);
            const url = URL.createObjectURL(file);
            setLocalPreview(url);

            try {
              await onUpload(file);
            } catch {
            }
          }}
        />
      </div>
    </div>
  );
};

export default AvatarCard;