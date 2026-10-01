import AvatarCircle from "./AvatarCircle";

type Props = {
  name: string;
  avatarUrl: string | null;
  subtitle?: string;
  metaRight?: string;
};

const ProfileHeader = ({ name, avatarUrl, subtitle, metaRight }: Props) => {
  return (
    <div className="flex items-center gap-3">
      <AvatarCircle src={avatarUrl} name={name} size="lg" />
      <div className="min-w-0 flex-1">
        <div className="text-base font-semibold text-foreground truncate">{name}</div>
        {subtitle ? (
          <div className="mt-1 text-sm text-muted-foreground truncate">{subtitle}</div>
        ) : null}
      </div>
      {metaRight ? (
        <div className="text-xs text-muted-foreground text-right">{metaRight}</div>
      ) : null}
    </div>
  );
};

export default ProfileHeader;