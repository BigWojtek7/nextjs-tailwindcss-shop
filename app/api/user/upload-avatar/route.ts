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
      { error: 'Unauthorized access' },
      { status: 401 }
    );
  }

  const formData = await request.formData();
  const file = formData.get('avatar') as File;

  // Walidacja pliku
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json(
      { error: 'File is too large (max 2MB)' },
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
    console.error('Error during avatar upload:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
