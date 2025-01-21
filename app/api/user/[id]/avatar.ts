// pages/api/user/[id]/avatar.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    const user = await prisma.user.findUnique({
      where: { id: id as string },
      select: { avatar: true, avatarUrl: true },
    });

    if (!user) {
      res.setHeader('Content-Type', 'image/png');
      return res.redirect(302, `${process.env.NEXTAUTH_URL}/default-avatar.png`);
    }

    if (user.avatar) {
      res.setHeader('Content-Type', 'image/webp');
      res.setHeader('Cache-Control', 'public, max-age=604800');
      return res.send(user.avatar);
    }

    const redirectUrl = user.avatarUrl?.startsWith('http')
      ? user.avatarUrl
      : `${process.env.NEXTAUTH_URL}${user.avatarUrl || '/default-avatar.png'}`;

    return res.redirect(302, redirectUrl);

  } catch (error) {
    console.error('Avatar API Error:', error);
    res.setHeader('Content-Type', 'image/png');
    return res.redirect(302, `${process.env.NEXTAUTH_URL}/default-avatar.png`);
  }
}