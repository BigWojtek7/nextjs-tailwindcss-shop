import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/authOptions';
import { prisma } from '@/app/lib/prisma';
import { hash } from 'bcryptjs';
import { Prisma } from '@prisma/client';
interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'You must be logged in' },
      { status: 401 }
    );
  }

  try {
    const data: UpdateUserData = await req.json();
    const { name, email, password } = data;

    const updateData: Prisma.UserUpdateInput = {};

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
      { message: 'User data has been updated', user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update user error:', error);

    const e = error as { code?: string; message?: string };

    if (e.code === 'P2002') {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'An error occurred while updating data' },
      { status: 500 }
    );
  }
}
