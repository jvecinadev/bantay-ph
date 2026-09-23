import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ROUTES } from "../app/router/routes";
import LeafletPicker from "../features/reports/map/LeafletPicker";
import { CATEGORY_OPTIONS } from "../features/reports/constants";
import type { ReportCategory } from "../features/reports/types";

import useCreateReportMutation from "../features/reports/hooks/useCreateReportMutation";
import { reportsApi } from "../features/reports/api";
import type { ApiError } from "../lib/api/types";

type UploadArgs = { reportId: string; files: File[] };

const MAX_PHOTOS = 3;
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const NewReportPage = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const createMutation = useCreateReportMutation();

  const uploadPhotosMutation = useMutation<unknown, ApiError, UploadArgs>({
    mutationFn: ({ reportId, files }) => reportsApi.uploadPhotos(reportId, files),
    onSuccess: async (_data, vars) => {
      await qc.invalidateQueries({ queryKey: ["reports", "detail", vars.reportId] });
    },
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ReportCategory>("ROAD_DAMAGE");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const [createdReportId, setCreatedReportId] = useState<string | null>(null);
  const [photoUploadFailed, setPhotoUploadFailed] = useState(false);

  const canSubmit = useMemo(() => {
    return title.trim().length >= 3 && description.trim().length >= 10 && !!coords;
  }, [title, description, coords]);

  const previews = useMemo(() => {
    return photoFiles.map((f) => ({
      file: f,
      url: URL.createObjectURL(f),
    }));
  }, [photoFiles]);

  useMemo(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoFiles]);

  const validateAndSetPhotos = (files: FileList | null) => {
    setPhotoError(null);
    if (!files) return;

    const picked = Array.from(files);

    const invalidType = picked.find((f) => !ALLOWED_TYPES.includes(f.type));
    if (invalidType) {
      setPhotoError("Only JPG, PNG, or WEBP images are allowed.");
      return;
    }

    const tooLarge = picked.find((f) => f.size > MAX_BYTES);
    if (tooLarge) {
      setPhotoError("Each photo must be 5MB or less.");
      return;
    }

    if (picked.length > MAX_PHOTOS) {
      setPhotoError("You can select up to 3 photos.");
      setPhotoFiles(picked.slice(0, MAX_PHOTOS));
      return;
    }

    setPhotoFiles(picked);
  };

  const removePhotoAt = (index: number) => {
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setPhotoUploadFailed(false);
    setCreatedReportId(null);

    createMutation.reset();
    uploadPhotosMutation.reset();

    if (!coords) return;

    const created = await createMutation.mutateAsync({
      title: title.trim(),
      description: description.trim(),
      category,
      latitude: String(coords.lat),
      longitude: String(coords.lng),
    });

    const reportId = (created as any)?.report?.id as string | undefined;

    if (!reportId) {
      navigate(ROUTES.reportMine, { replace: true });
      return;
    }

    if (photoFiles.length > 0) {
      try {
        await uploadPhotosMutation.mutateAsync({ reportId, files: photoFiles });
        navigate(ROUTES.reportMine, { replace: true });
        return;
      } catch {
        setCreatedReportId(reportId);
        setPhotoUploadFailed(true);
        return;
      }
    }

    navigate(ROUTES.reportMine, { replace: true });
  };

  const isSubmitting = createMutation.isPending || uploadPhotosMutation.isPending;

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          New Report
        </h1>
        <p className="mt-1.5 text-sm text-text-secondary">
          Submit a local issue with an exact location.
        </p>
      </div>

      {createMutation.error ? (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-danger/30 bg-danger-light px-4 py-3 text-sm text-danger">
          <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-danger/20 text-[10px] font-bold">
            !
          </span>
          <span className="leading-relaxed">{createMutation.error.message}</span>
        </div>
      ) : null}

      {photoUploadFailed && createdReportId ? (
        <div className="mt-6 rounded-xl border border-danger/30 bg-danger-light px-4 py-4">
          <div className="text-sm font-semibold text-danger">
            Report submitted, but photo upload failed
          </div>
          <p className="mt-1 text-sm leading-relaxed text-danger/80">
            You can retry while the report is still <span className="font-medium">REPORTED</span>.
          </p>

          {uploadPhotosMutation.error ? (
            <p className="mt-2 text-xs text-danger">
              {uploadPhotosMutation.error.message}
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => uploadPhotosMutation.mutate({ reportId: createdReportId, files: photoFiles })}
              disabled={uploadPhotosMutation.isPending || photoFiles.length === 0}
              className="rounded-lg bg-danger px-3.5 py-2 text-xs font-semibold text-surface transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploadPhotosMutation.isPending ? "Retrying…" : "Retry upload"}
            </button>

            <button
              type="button"
              onClick={() => navigate(`/reports/${createdReportId}`)}
              className="rounded-lg border border-danger/30 bg-surface px-3.5 py-2 text-xs font-semibold text-danger transition-colors hover:bg-danger-light"
            >
              Open report
            </button>

            <button
              type="button"
              onClick={() => navigate(ROUTES.reportMine, { replace: true })}
              className="rounded-lg px-3.5 py-2 text-xs font-medium text-danger/80 transition-colors hover:text-danger"
            >
              Continue →
            </button>
          </div>
        </div>
      ) : null}

      <div className="mt-8 lg:grid lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-8">
        <form onSubmit={onSubmit}>
          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
            <div className="p-5 sm:p-7">
              <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Details
              </div>

              <div className="mt-5 space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-text-primary">
                    Title
                  </label>
                  <input
                    id="title"
                    className="mt-2 w-full rounded-xl border border-border-strong bg-surface px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 transition-colors focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Large pothole near the barangay hall"
                  />
                  <p className="mt-1.5 text-xs text-text-secondary">
                    Keep it short and specific.
                  </p>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-text-primary">
                    Description
                  </label>
                  <textarea
                    id="description"
                    className="mt-2 min-h-32 w-full resize-y rounded-xl border border-border-strong bg-surface px-3.5 py-2.5 text-sm leading-relaxed text-text-primary placeholder:text-text-secondary/60 transition-colors focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add details (what happened, how bad, landmarks, etc.)"
                  />
                  <p className="mt-1.5 text-xs text-text-secondary">
                    {description.trim().length < 10 ? "At least 10 characters." : "Looks good."}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-border p-5 sm:p-7">
              <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Category
              </div>

              <div className="mt-4">
                <select
                  id="category"
                  className="w-full appearance-none rounded-xl border border-border-strong bg-surface px-3.5 py-2.5 pr-9 text-sm font-medium text-text-primary transition-colors focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.75rem center",
                  }}
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ReportCategory)}
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="border-t border-border p-5 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Location
                  </div>
                  <p className="mt-1.5 text-xs text-text-secondary">
                    Tap the map to place the marker, then drag to adjust.
                  </p>
                </div>

                {coords ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-success-light px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-success">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    Pinned
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-sunken px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
                    <span className="h-1.5 w-1.5 rounded-full bg-text-secondary/50" />
                    Not set
                  </span>
                )}
              </div>

              <div className="mt-4 overflow-hidden rounded-xl border border-border">
                <LeafletPicker value={coords} onChange={setCoords} />
              </div>

              {coords ? (
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-surface-sunken px-2.5 py-1">
                  <span className="h-1 w-1 rounded-full bg-primary" />
                  <span className="font-mono text-[11px] text-text-secondary">
                    {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
                  </span>
                </div>
              ) : null}
            </div>

            <div className="border-t border-border p-5 sm:p-7">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Photos
                  </div>
                  <p className="mt-1.5 text-xs text-text-secondary">
                    Optional — up to {MAX_PHOTOS} images, 5MB each.
                  </p>
                </div>

                {photoFiles.length > 0 ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-sunken px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
                    {photoFiles.length} / {MAX_PHOTOS}
                  </span>
                ) : null}
              </div>

              {photoError ? (
                <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-danger/30 bg-danger-light px-3.5 py-2.5 text-xs text-danger">
                  <span className="mt-0.5 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-danger/20 text-[9px] font-bold">
                    !
                  </span>
                  <span className="leading-relaxed">{photoError}</span>
                </div>
              ) : null}

              {previews.length > 0 ? (
                <div className="mt-4 grid grid-cols-3 gap-2.5 sm:gap-3">
                  {previews.map((p, idx) => (
                    <div
                      key={p.url}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-surface-sunken"
                    >
                      <img
                        src={p.url}
                        alt={p.file.name}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePhotoAt(idx)}
                        disabled={isSubmitting}
                        aria-label="Remove photo"
                        className="absolute right-1.5 top-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-text-primary/70 text-surface backdrop-blur-sm transition-colors hover:bg-text-primary/90 disabled:opacity-60"
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}

              {photoFiles.length < MAX_PHOTOS ? (
                <label
                  className={`mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border-strong bg-surface-sunken/50 px-4 py-6 text-sm font-medium text-text-secondary transition-colors hover:border-primary hover:bg-primary-light/30 hover:text-primary ${
                    isSubmitting ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-surface shadow-card">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                  {previews.length > 0 ? "Add more" : "Choose photos"}
                  <input
                    className="sr-only"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={(e) => {
                      validateAndSetPhotos(e.target.files);
                      e.currentTarget.value = "";
                    }}
                    disabled={isSubmitting}
                  />
                </label>
              ) : null}
            </div>

            <div className="border-t border-border p-5 sm:p-7">
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-surface shadow-card transition-all hover:bg-primary-dark hover:shadow-card-hover focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              >
                {createMutation.isPending
                  ? "Submitting…"
                  : uploadPhotosMutation.isPending
                    ? "Uploading photos…"
                    : "Submit report"}
              </button>

              <p className="mt-3 text-center text-xs text-text-secondary">
                Your report will go through verification after submission.
              </p>
            </div>
          </div>
        </form>

        <aside className="mt-6 lg:mt-0">
          <div className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
              <div className="p-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Tips
                </div>
                <ul className="mt-4 space-y-4">
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light text-[11px] font-bold text-primary">
                      1
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-text-primary">
                        Be specific
                      </div>
                      <div className="mt-0.5 text-xs leading-relaxed text-text-secondary">
                        Mention landmarks and what exactly is wrong.
                      </div>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light text-[11px] font-bold text-primary">
                      2
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-text-primary">
                        Pin it precisely
                      </div>
                      <div className="mt-0.5 text-xs leading-relaxed text-text-secondary">
                        Drag the marker to the exact spot so staff can find it.
                      </div>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light text-[11px] font-bold text-primary">
                      3
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-text-primary">
                        Stay factual
                      </div>
                      <div className="mt-0.5 text-xs leading-relaxed text-text-secondary">
                        Report what you observed, not opinions.
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="border-t border-border p-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  What happens next
                </div>
                <p className="mt-3 text-xs leading-relaxed text-text-secondary">
                  A validator will review your report. Once verified, it appears on the public feed and gets routed to the right staff.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default NewReportPage;