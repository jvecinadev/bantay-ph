import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  children: ReactNode;
};

const SettingsCard = ({ title, description, children }: Props) => {
  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3">
        <div className="text-sm font-semibold text-foreground">{title}</div>
        {description ? (
          <div className="mt-1 text-xs text-muted-foreground">{description}</div>
        ) : null}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
};

export default SettingsCard;