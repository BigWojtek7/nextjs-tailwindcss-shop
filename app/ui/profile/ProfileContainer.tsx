interface ProfileContainerProps {
  children: React.ReactNode;
}

export function ProfileContainer({ children }: ProfileContainerProps) {
  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="container mx-auto max-w-5xl px-4">{children}</div>
    </div>
  );
}
