'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import Image from 'next/image';

const AvatarUpload = () => {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarVersion, setAvatarVersion] = useState(0); // Add avatar version state

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session?.user?.id) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File is too large (max 2MB)');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await fetch('/api/user/upload-avatar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload error');

      // Force update by changing version
      setAvatarVersion((prev) => prev + 1);
      await update();

      toast.success('Avatar updated!');
    } catch (error) {
      console.error(error);
      toast.error('Error while changing avatar');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate unique URL with timestamp
  const avatarUrl = session?.user?.avatarUrl
    ? `${session.user.avatarUrl}?v=${avatarVersion}&ts=${Date.now()}`
    : '/default-avatar.png';

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-gray-200">
        <Image
          src={avatarUrl}
          alt="User avatar"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 768px"
          key={avatarVersion} // Force component remount
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/default-avatar.png';
          }}
        />
      </div>

      <label className="relative cursor-pointer">
        <span
          className={`rounded-lg px-4 py-2 text-white transition-colors ${
            isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isLoading ? 'Uploading...' : 'Change avatar'}
        </span>
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleUpload}
          className="sr-only"
          disabled={isLoading}
        />
      </label>
    </div>
  );
};

export default AvatarUpload;
