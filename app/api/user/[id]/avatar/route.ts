// app/api/user/[id]/avatar/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: { avatar: true, avatarUrl: true },
    });

    if (!user) {
      return new NextResponse(null, {
        status: 302,
        headers: {
          Location: `${process.env.NEXTAUTH_URL}/default-avatar.png`,
          'Content-Type': 'image/png',
        },
      });
    }

    if (user.avatar) {
      return new Response(user.avatar, {
        headers: {
          'Content-Type': 'image/webp',
          'Cache-Control': 'public, max-age=604800',
        },
      });
    }

    const redirectUrl = user.avatarUrl?.startsWith('http')
      ? user.avatarUrl
      : `${process.env.NEXTAUTH_URL}${user.avatarUrl || '/default-avatar.png'}`;

    return new NextResponse(null, {
      status: 302,
      headers: {
        Location: redirectUrl,
        'Content-Type': 'image/png',
      },
    });
    
  } catch (error) {
    console.error('Avatar API Error:', error);
    return new NextResponse(null, {
      status: 302,
      headers: {
        Location: `${process.env.NEXTAUTH_URL}/default-avatar.png`,
        'Content-Type': 'image/png',
      },
    });
  }
}