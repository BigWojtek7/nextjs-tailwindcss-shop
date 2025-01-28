
import Button from "@/app/ui/button/Button";
import UserAvatar from "@/app/ui/avatar/UserAvatar";


interface ProfileHeaderProps {
  onSignOut: () => void;
}

export function ProfileHeader({ onSignOut }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <UserAvatar size={200} />
      <Button
        onClick={onSignOut}
        className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Sign Out
      </Button>
    </div>
  );
}