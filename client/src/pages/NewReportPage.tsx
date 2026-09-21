
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

  // If create succeeded but photo upload failed, keep reportId so user can retry or open detail
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

  // Cleanup object URLs
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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">New Report</h1>
        <p className="mt-1.5 text-sm text-text-secondary">Submit a local issue with an exact location.</p>
      </div>

      {createMutation.error ? (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-danger bg-danger-light px-4 py-3 text-sm text-danger">
          <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-danger-light text-[10px] font-bold">
            !
          </span>
          <span className="leading-relaxed">{createMutation.error.message}</span>
        </div>
      ) : null}

      {photoUploadFailed && createdReportId ? (
        <div className="mt-6 rounded-xl border border-border bg-background px-4 py-3">
          <div className="text-sm font-semibold text-text-primary">
            Report submitted, but photo upload failed
          </div>
          <div className="mt-1 text-sm text-text-secondary">
            You can retry upload while the report is still <span className="text-text-primary">REPORTED</span>.
          </div>

          {uploadPhotosMutation.error ? (
            <div className="mt-3 rounded-lg border border-danger bg-danger-light p-3 text-sm text-danger">
              {uploadPhotosMutation.error.message}
            </div>
          ) : null}

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => uploadPhotosMutation.mutate({ reportId: createdReportId, files: photoFiles })}
              disabled={uploadPhotosMutation.isPending || photoFiles.length === 0}
              className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-surface hover:bg-primary-dark disabled:opacity-50"
            >
              {uploadPhotosMutation.isPending ? "Retrying…" : "Retry upload"}
            </button>

            <button
              type="button"
              onClick={() => navigate(`/reports/${createdReportId}`)}
              className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text-primary hover:border-primary"
            >
              Open report detail
            </button>

            <button
              type="button"
              onClick={() => navigate(ROUTES.reportMine, { replace: true })}
              className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text-primary hover:border-primary"
            >
              Continue
            </button>
          </div>
        </div>
      ) : null}

      <div className="mt-6 lg:grid lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-6">
        {/* ============ FORM ============ */}
        <form onSubmit={onSubmit}>
          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            {/* -------- Section 1: Details -------- */}
            <div className="p-5 sm:p-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Details</div>

              <div className="mt-4 space-y-5">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-text-primary">
                    Title
                  </label>
                  <input
                    id="title"
                    className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Large pothole near the barangay hall"
                  />
                  <div className="mt-1.5 text-xs text-text-secondary">Keep it short and specific.</div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-text-primary">
                    Description
                  </label>
                  <textarea
                    id="description"
                    className="mt-1.5 min-h-32 w-full resize-y rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm leading-relaxed text-text-primary placeholder:text-text-secondary/60 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add details (what happened, how bad, landmarks, etc.)"
                  />
                  <div className="mt-1.5 text-xs text-text-secondary">
                    {description.trim().length < 10 ? "At least 10 characters." : "Looks good."}
                  </div>
                </div>
              </div>
            </div>

            {/* -------- Section 2: Category -------- */}
            <div className="border-t border-border p-5 sm:p-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Category</div>

              <div className="mt-4">
                <select
                  id="category"
                  className="w-full appearance-none rounded-xl border border-border bg-surface px-3.5 py-2.5 pr-9 text-sm font-medium text-text-primary focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
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

            {/* -------- Section 3: Location -------- */}
            <div className="border-t border-border p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Location</div>
                  <div className="mt-1 text-xs text-text-secondary">
                    Tap the map to place the marker, then drag to adjust.
                  </div>
                </div>

                {coords ? (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-success-light px-2.5 py-1 text-xs font-medium text-success">
                      <span className="h-1.5 w-1.5 rounded-full bg-success" />
                      Pinned
                    </span>
                    <span className="rounded-full border border-border bg-surface px-2.5 py-1 font-mono text-xs text-text-secondary">
                      {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                    </span>
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium text-text-secondary">
                    <span className="h-1.5 w-1.5 rounded-full bg-text-secondary/50" />
                    No location selected
                  </span>
                )}
              </div>

              <div className="mt-4 overflow-hidden rounded-xl border border-border">
                <LeafletPicker value={coords} onChange={setCoords} />
              </div>
            </div>

            {/* -------- Section 4: Photos -------- */}
            <div className="border-t border-border p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Photos</div>
                  <div className="mt-1 text-xs text-text-secondary">
                    Optional. Up to 3 images (JPG/PNG/WEBP), 5MB each.
                  </div>
                </div>

                <div className="text-xs text-text-secondary">
                  Selected: <span className="text-text-primary">{photoFiles.length}</span> / {MAX_PHOTOS}
                </div>
              </div>

              {photoError ? (
                <div className="mt-3 rounded-lg border border-danger bg-danger-light p-3 text-sm text-danger">
                  {photoError}
                </div>
              ) : null}

              <input
                className="mt-3 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text-primary file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-semibold file:text-surface hover:file:bg-primary-dark"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={(e) => {
                  validateAndSetPhotos(e.target.files);
                  e.currentTarget.value = "";
                }}
                disabled={isSubmitting}
              />

              {previews.length ? (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {previews.map((p, idx) => (
                    <div key={p.url} className="relative overflow-hidden rounded-xl border border-border bg-background">
                      <img src={p.url} alt={p.file.name} className="h-24 w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePhotoAt(idx)}
                        disabled={isSubmitting}
                        className="absolute right-1 top-1 rounded-lg border border-border bg-surface px-2 py-1 text-xs text-text-primary disabled:opacity-60"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="mt-3 text-xs text-text-secondary">
                Photos upload after the report is created. If upload fails, you can retry while status is{" "}
                <span className="text-text-primary">REPORTED</span>.
              </div>
            </div>

            {/* -------- Section 5: Submit -------- */}
            <div className="border-t border-border bg-background p-5 sm:p-6">
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-surface hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {createMutation.isPending
                  ? "Submitting…"
                  : uploadPhotosMutation.isPending
                    ? "Uploading photos…"
                    : "Submit Report"}
              </button>

              <p className="mt-3 text-center text-xs text-text-secondary">
                After submission, your report will go through verification.
              </p>
            </div>
          </div>
        </form>

        {/* ============ RIGHT RAIL ============ */}
        <aside className="mt-6 lg:mt-0">
          <div className="lg:sticky lg:top-24 lg:space-y-4">
            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Tips</div>
              <ul className="mt-4 space-y-4">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">
                    1
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-text-primary">Be specific</div>
                    <div className="mt-0.5 text-xs leading-relaxed text-text-secondary">
                      Mention landmarks and what exactly is wrong.
                    </div>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">
                    2
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-text-primary">Pin it precisely</div>
                    <div className="mt-0.5 text-xs leading-relaxed text-text-secondary">
                      Drag the marker to the exact spot so staff can find it.
                    </div>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">
                    3
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-text-primary">Stay factual</div>
                    <div className="mt-0.5 text-xs leading-relaxed text-text-secondary">
                      Report what you observed, not opinions.
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="mt-4 rounded-2xl border border-border bg-background p-5 lg:mt-0">
              <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">What happens next</div>
              <p className="mt-3 text-xs leading-relaxed text-text-secondary">
                A validator will review your report. Once verified, it appears on the public feed and gets routed to
                the right staff.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default NewReportPage;