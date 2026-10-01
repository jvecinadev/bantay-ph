type Props = {
  mode: "public" | "private";
};

const ProfileModePill = ({ mode }: Props) => {
  const isPrivate = mode === "private";

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider",
        isPrivate
          ? "bg-primary-light text-primary"
          : "bg-surface-sunken text-text-secondary",
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          isPrivate ? "bg-primary" : "bg-text-secondary/60",
        ].join(" ")}
      />
      {isPrivate ? "Admin view" : "Public view"}
    </span>
  );
};

export default ProfileModePill;