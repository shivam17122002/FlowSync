import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const WorkspaceAvatar = ({
  color,
  name,
}: {
  color: string;
  name: string;
}) => {
  return (
    <div
      className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/50 shadow-sm"
      style={{
        background: `linear-gradient(135deg, ${color}, color-mix(in srgb, ${color} 45%, white))`,
      }}
    >
      <span className="text-sm font-semibold text-white">
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
};
