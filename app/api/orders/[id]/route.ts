import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/app/lib/prisma';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const { id } = params;

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Musisz być zalogowany' },
      { status: 401 }
    );
  }

  try {
    // Sprawdź, czy zamówienie należy do użytkownika
    const order = await prisma.order.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Zamówienie nie zostało znalezione' },
        { status: 404 }
      );
    }

    if (order.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Nie masz uprawnień do usunięcia tego zamówienia' },
        { status: 403 }
      );
    }

    // Usuń zamówienie
    await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Zamówienie zostało usunięte' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete order error:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas usuwania zamówienia' },
      { status: 500 }
    );
  }
} 