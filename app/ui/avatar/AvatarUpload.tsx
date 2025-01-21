'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import Image from 'next/image';

const AvatarUpload = () => {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session?.user?.id) return;

    // Walidacja pliku
    if (!file.type.startsWith('image/')) {
      toast.error('Proszę wybrać plik obrazu');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Plik jest zbyt duży (maks. 2MB)');
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
      console.log(response);
      if (!response.ok) throw new Error('Błąd uploadu');

      // Aktualizacja sesji - NOWA SYNTAXA
      await update({
        avatar: `${window.location.origin}/api/user/${session.user.id}/avatar?${Date.now()}`,
      });

      toast.success('Avatar zaktualizowany!');
    } catch (error) {
      console.error(error);
      toast.error('Błąd podczas zmiany avatara');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-gray-200">
        <Image
          src={session?.user?.avatar || '/default-avatar.png'}
          alt="Avatar użytkownika"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 768px"
        />
      </div>

      <label className="relative cursor-pointer">
        <span className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600">
          {isLoading ? 'Przesyłanie...' : 'Zmień avatar'}
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
