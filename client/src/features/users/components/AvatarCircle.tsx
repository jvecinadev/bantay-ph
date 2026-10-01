type Props = {
  src?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg";
};

const AvatarCircle = ({ src, name, size = "md" }: Props) => {
  const px =
    size === "sm" ? "h-10 w-10" : size === "lg" ? "h-20 w-20" : "h-14 w-14";

  const initials =
    (name ?? "")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join("") || "?";

  if (src) {
    return (
      <img
        src={src}
        alt={name ?? "Avatar"}
        className={`${px} rounded-full border border-border object-cover`}
      />
    );
  }

  return (
    <div
      className={`${px} grid place-items-center rounded-full border border-border bg-muted text-sm font-semibold text-foreground`}
      aria-label={name ?? "Avatar"}
    >
      {initials}
    </div>
  );
};

export default AvatarCircle;