type SectionProps = {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
};

const Section = ({ title, right, children }: SectionProps) => {
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-text-primary">
          {title}
        </h2>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
      {children}
    </section>
  );
};

export default Section;