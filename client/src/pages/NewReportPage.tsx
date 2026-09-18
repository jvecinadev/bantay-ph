import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../app/router/routes";
import LeafletPicker from "../features/reports/map/LeafletPicker";
import { CATEGORY_OPTIONS } from "../features/reports/constants";
import type { ReportCategory } from "../features/reports/types";
import useCreateReportMutation from "../features/reports/hooks/useCreateReportMutation";

const NewReportPage = () => {
  const navigate = useNavigate();
  const createMutation = useCreateReportMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ReportCategory>("ROAD_DAMAGE");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const canSubmit = useMemo(() => {
    return title.trim().length >= 3 && description.trim().length >= 10 && !!coords;
  }, [title, description, coords]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.reset();

    if (!coords) return;

    await createMutation.mutateAsync({
      title: title.trim(),
      description: description.trim(),
      category,
      latitude: String(coords.lat),
      longitude: String(coords.lng),
    });

    navigate(ROUTES.reportMine, { replace: true });
  };

  return (
    <div>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">New Report</h1>
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

      <div className="mt-6 lg:grid lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-6">
        {/* ============ FORM ============ */}
        <form onSubmit={onSubmit}>
          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
            {/* -------- Section 1: Details -------- */}
            <div className="p-5 sm:p-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Details
              </div>

              <div className="mt-4 space-y-5">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-text-primary"
                  >
                    Title
                  </label>
                  <input
                    id="title"
                    className="mt-1.5 w-full rounded-xl border border-border-strong bg-surface px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 transition-colors focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Large pothole near the barangay hall"
                  />
                  <div className="mt-1.5 text-xs text-text-secondary">
                    Keep it short and specific.
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-text-primary"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    className="mt-1.5 min-h-32 w-full resize-y rounded-xl border border-border-strong bg-surface px-3.5 py-2.5 text-sm leading-relaxed text-text-primary placeholder:text-text-secondary/60 transition-colors focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add details (what happened, how bad, landmarks, etc.)"
                  />
                  <div className="mt-1.5 text-xs text-text-secondary">
                    {description.trim().length < 10
                      ? "At least 10 characters."
                      : "Looks good."}
                  </div>
                </div>
              </div>
            </div>

            {/* -------- Section 2: Category -------- */}
            <div className="border-t border-border p-5 sm:p-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Category
              </div>

              <div className="mt-4">
                <select
                  id="category"
                  className="w-full appearance-none rounded-xl border border-border-strong bg-surface px-3.5 py-2.5 pr-9 text-sm font-medium text-text-primary transition-colors hover:border-text-secondary/40 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
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

            {/* -------- Section 3: Location -------- */}
            <div className="border-t border-border p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Location
                  </div>
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
                    <span className="rounded-full bg-surface-sunken px-2.5 py-1 font-mono text-xs text-text-secondary">
                      {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                    </span>
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-sunken px-2.5 py-1 text-xs font-medium text-text-secondary">
                    <span className="h-1.5 w-1.5 rounded-full bg-text-secondary/50" />
                    No location selected
                  </span>
                )}
              </div>

              <div className="mt-4 overflow-hidden rounded-xl border border-border">
                <LeafletPicker value={coords} onChange={setCoords} />
              </div>
            </div>

            {/* -------- Section 4: Submit -------- */}
            <div className="border-t border-border bg-surface-sunken/50 p-5 sm:p-6">
              <button
                type="submit"
                disabled={!canSubmit || createMutation.isPending}
                className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-surface shadow-card transition-all hover:bg-primary-dark hover:shadow-card-hover focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              >
                {createMutation.isPending ? "Submitting…" : "Submit Report"}
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
            {/* Tips */}
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
              <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Tips
              </div>
              <ul className="mt-4 space-y-4">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">
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
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">
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
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">
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

            {/* What happens next */}
            <div className="mt-4 rounded-2xl border border-border bg-surface-sunken p-5 lg:mt-0">
              <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                What happens next
              </div>
              <p className="mt-3 text-xs leading-relaxed text-text-secondary">
                A validator will review your report. Once verified, it appears
                on the public feed and gets routed to the right staff.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default NewReportPage;