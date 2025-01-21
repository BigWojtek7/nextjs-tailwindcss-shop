// pages/api/user/upload-avatar.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { IncomingForm, File } from 'formidable';
import { promises as fs } from 'fs';
import sharp from 'sharp';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Nieautoryzowany dostęp' });
  }

  const form = new IncomingForm();
  
  try {
    const [fields, files] = await new Promise<[any, any]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const imageFile = files.avatar?.[0] as File;
    
    // Walidacja pliku
    if (!imageFile) {
      return res.status(400).json({ error: 'Brak pliku' });
    }
    
    if (imageFile.size > 2 * 1024 * 1024) {
      return res.status(400).json({ error: 'Plik jest zbyt duży (max 2MB)' });
    }

    // Przetwarzanie obrazka
    const optimizedImage = await sharp(await fs.readFile(imageFile.filepath))
      .resize(256, 256)
      .webp({ quality: 80 })
      .toBuffer();

    // Aktualizacja użytkownika
    await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        avatar: optimizedImage,
        avatarUrl: null // Resetujemy URL jeśli był wcześniej ustawiony
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Błąd podczas uploadu avatara:', error);
    return res.status(500).json({ error: 'Wewnętrzny błąd serwera' });
  }
}