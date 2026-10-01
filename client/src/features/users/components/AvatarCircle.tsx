type Props = {
  src: string | null;
  name: string;
  size?: "md" | "lg";
};

const AvatarCircle = ({ src, name, size = "md" }: Props) => {
  const px = size === "lg" ? "h-20 w-20" : "h-14 w-14";

  const initials =
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join("") || "?";

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${px} rounded-full border border-border object-cover`}
      />
    );
  }

  return (
    <div
      className={`${px} grid place-items-center rounded-full border border-border bg-muted text-sm font-semibold text-foreground`}
      aria-label={name}
    >
      {initials}
    </div>
  );
};

export default AvatarCircle;