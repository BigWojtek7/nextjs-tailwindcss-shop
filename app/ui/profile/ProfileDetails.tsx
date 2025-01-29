interface ProfileDetailsProps {
  name: string;
  email: string;
}

export function ProfileDetails({ name, email }: ProfileDetailsProps) {
  return (
    <div className="flex-1 space-y-4">
      <h2 className="text-2xl font-bold text-white">Your Profile</h2>
      <div className="space-y-2 rounded-lg bg-gray-700 p-4">
        <div className="flex items-center gap-3">
          <span className="text-white">👤</span>
          <div>
            <p className="text-sm text-gray-300">Name</p>
            <p className="text-lg font-medium text-white">
              {name || 'No data'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white">📧</span>
          <div>
            <p className="text-sm text-gray-300">Email</p>
            <p className="text-lg font-medium text-white">{email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}