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
      <h1 className="text-lg font-semibold text-text-primary">New Report</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Submit a local issue with an exact location.
      </p>

      {createMutation.error ? (
        <div className="mt-4 rounded-lg border border-danger bg-danger-light p-3 text-sm text-danger">
          {createMutation.error.message}
        </div>
      ) : null}

      <form className="mt-4 space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="text-sm text-text-secondary">Title</label>
          <input
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Large pothole near the barangay hall"
          />
        </div>

        <div>
          <label className="text-sm text-text-secondary">Description</label>
          <textarea
            className="mt-1 min-h-28 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details (what happened, how bad, landmarks, etc.)"
          />
        </div>

        <div>
          <label className="text-sm text-text-secondary">Category</label>
          <select
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary"
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

        <div>
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-sm font-medium text-text-primary">Location</div>
              <div className="mt-1 text-xs text-text-secondary">
                Tap the map to place the marker, then drag to adjust.
              </div>
            </div>
            <div className="text-right text-xs text-text-secondary">
              {coords ? (
                <>
                  <div>
                    Lat: <span className="text-text-primary">{coords.lat.toFixed(6)}</span>
                  </div>
                  <div>
                    Lng: <span className="text-text-primary">{coords.lng.toFixed(6)}</span>
                  </div>
                </>
              ) : (
                "No location selected"
              )}
            </div>
          </div>

          <div className="mt-2">
            <LeafletPicker value={coords} onChange={setCoords} />
          </div>
        </div>

        <button
          type="submit"
          disabled={!canSubmit || createMutation.isPending}
          className="w-full rounded-lg bg-primary px-3 py-2 text-sm font-medium text-surface hover:bg-primary-dark disabled:opacity-60"
        >
          {createMutation.isPending ? "Submitting…" : "Submit Report"}
        </button>

        <div className="text-xs text-text-secondary">
          After submission, your report will go through verification.
        </div>
      </form>
    </div>
  );
};

export default NewReportPage;