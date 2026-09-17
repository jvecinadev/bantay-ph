
import StatusBadge from "./StatusBadge";

type Props = {
  title: string;
  category: string;
  status: any;
  meta?: string;
  description?: string;
};

const ReportCard = ({ title, category, status, meta, description }: Props) => {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-text-primary">{title}</div>
          <div className="mt-1 text-xs text-text-secondary">{category}</div>
          {meta ? <div className="mt-1 text-xs text-text-secondary">{meta}</div> : null}
        </div>
        <StatusBadge status={status} />
      </div>

      {description ? (
        <p className="mt-3 text-sm text-text-secondary">{description}</p>
      ) : null}
    </div>
  );
};

export default ReportCard;