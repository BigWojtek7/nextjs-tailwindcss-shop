'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

const UserAvatar = ({ size = 32 }: { size?: number }) => {
  const { data: session } = useSession();
  const [avatarUrl, setAvatarUrl] = useState('/default-avatar.png');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const updateAvatar = async () => {
      if (!session?.user?.id || !isMounted) return;
      
      try {
        const url = `/api/user/${session.user.id}/avatar${isMounted ? `?ts=${Date.now()}` : ''}`;
        const response = await fetch(url);
        
        if (response.ok) {
          const blob = await response.blob();
          setAvatarUrl(URL.createObjectURL(blob));
        }
      } catch (error) {
        console.error('Error loading avatar:', error);
      }
    };

    updateAvatar();
  }, [session?.user?.id, isMounted]);

  return (
    <div className="relative inline-block">
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
        priority
        onLoadingComplete={() => setIsMounted(true)}
        onError={() => setAvatarUrl('/default-avatar.png')}
      />
      {!isMounted && (
        <div 
          className="absolute inset-0 animate-pulse rounded-full bg-gray-200"
          style={{ width: size, height: size }}
        />
      )}
    </div>
  );
};

export default UserAvatar;