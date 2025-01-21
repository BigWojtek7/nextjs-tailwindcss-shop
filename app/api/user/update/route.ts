import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/app/lib/prisma';
import { hash } from 'bcryptjs';

interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Musisz być zalogowany' },
      { status: 401 }
    );
  }

  try {
    const data: UpdateUserData = await req.json();
    const { name, email, password } = data;

    const updateData: any = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) {
      const hashedPassword = await hash(password, 12);
      updateData.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json(
      { message: 'Dane użytkownika zostały zaktualizowane', user: updatedUser },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update user error:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Użytkownik z tym adresem email już istnieje' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Wystąpił błąd podczas aktualizacji danych' },
      { status: 500 }
    );
  }
}
