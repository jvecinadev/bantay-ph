import { Link } from "react-router-dom";

type LegalLayoutProps = {
  title: string;
  lastUpdated?: string;
  children: React.ReactNode;
};

const LegalLayout = ({ title, lastUpdated, children }: LegalLayoutProps) => {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-10">
      <div className="mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-primary"
        >
          <span aria-hidden="true">←</span>
          Back
        </Link>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-7">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          {title}
        </h1>
        {lastUpdated ? (
          <div className="mt-2 text-sm text-text-secondary">Last updated: {lastUpdated}</div>
        ) : null}

        <div className="mt-6 space-y-6 text-sm leading-relaxed text-text-primary">
          {children}
        </div>
      </div>
    </div>
  );
};

export default LegalLayout;