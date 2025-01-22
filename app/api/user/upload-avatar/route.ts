// app/api/user/upload-avatar/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/authOptions';
import { PrismaClient } from '@prisma/client';
import sharp from 'sharp';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Nieautoryzowany dostęp' },
      { status: 401 }
    );
  }

  const formData = await request.formData();
  const file = formData.get('avatar') as File;

  // Walidacja pliku
  if (!file) {
    return NextResponse.json({ error: 'Brak pliku' }, { status: 400 });
  }

  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json(
      { error: 'Plik jest zbyt duży (max 2MB)' },
      { status: 400 }
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    // Przetwarzanie obrazka
    const optimizedImage = await sharp(buffer)
      .resize(256, 256)
      .webp({ quality: 80 })
      .toBuffer();

    // Aktualizacja użytkownika
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        avatar: optimizedImage,
        avatarUrl: `/api/user/${session.user.id}/avatar`,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Błąd podczas uploadu avatara:', error);
    return NextResponse.json(
      { error: 'Wewnętrzny błąd serwera' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
