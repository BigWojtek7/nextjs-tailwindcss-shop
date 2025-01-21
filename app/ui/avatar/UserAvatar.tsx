// components/UserAvatar.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

const UserAvatar = ({ size = 32 }: { size?: number }) => {
  const { data: session } = useSession();
  const [avatarUrl, setAvatarUrl] = useState('/default-avatar.png');

  useEffect(() => {
    const loadAvatar = async () => {
      if (!session?.user?.id) return;

      try {
        const url = `/api/user/${session.user.id}/avatar?${Date.now()}`;
        const response = await fetch(url);

        if (response.ok) {
          const blob = await response.blob();
          setAvatarUrl(URL.createObjectURL(blob));
        }
      } catch (error) {
        console.error('Błąd ładowania avatara:', error);
      }
    };

    loadAvatar();
  }, [session?.user?.id]);

  return (
    <Image
      src={avatarUrl}
      alt="Avatar użytkownika"
      width={size}
      height={size}
      className="rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
};

export default UserAvatar;
