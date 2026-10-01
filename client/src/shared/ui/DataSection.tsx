import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  children: ReactNode;
};

const DataSection = ({ title, description, children }: Props) => (
  <section>
    <div className="flex items-baseline justify-between gap-3">
      <h2 className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
        {title}
      </h2>
      {description ? (
        <span className="text-[11px] text-text-secondary">{description}</span>
      ) : null}
    </div>
    <dl className="mt-3 divide-y divide-border border-y border-border">
      {children}
    </dl>
  </section>
);

export default DataSection;