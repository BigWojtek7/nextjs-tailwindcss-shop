import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/authOptions';
import { prisma } from '@/app/lib/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { Prisma } from '@prisma/client';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const id = (await params).id

  if (!id || typeof id !== 'string' || id.trim() === '') {
    return NextResponse.json(
      { error: 'Nieprawidłowy format ID zamówienia' },
      { status: 400 }
    );
  }

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || typeof session.user.id !== 'string') {
      console.error('Brak sesji lub nieprawidłowe ID użytkownika');
      return NextResponse.json(
        { error: 'Wymagane uwierzytelnienie' },
        { status: 401 }
      );
    }

    await prisma.$transaction(async (prisma: Prisma.TransactionClient) => {
      const order = await prisma.order.findUnique({
        where: { id },
        select: { userId: true },
      });

      if (!order) throw new Error('NOT_FOUND');
      if (order.userId !== session.user.id) throw new Error('FORBIDDEN');

      await prisma.orderItem.deleteMany({
        where: { orderId: id },
      });

      await prisma.order.delete({
        where: { id },
      });
    }); // Usunięto przypisanie do zmiennej

    return NextResponse.json(
      { message: 'Zamówienie zostało usunięte' },
      { status: 200 }
    );
  } catch (error) {
    // Poprawne logowanie błędów
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('[ORDER_DELETE_ERROR]', errorMessage);

    // Obsługa własnych błędów
    if (errorMessage === 'NOT_FOUND') {
      return NextResponse.json(
        { error: 'Zamówienie nie istnieje' },
        { status: 404 }
      );
    }

    if (errorMessage === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 });
    }

    // Obsługa błędów Prisma
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2023':
          return NextResponse.json(
            { error: 'Nieprawidłowy format ID' },
            { status: 400 }
          );
        case 'P2025':
          return NextResponse.json(
            { error: 'Zamówienie nie istnieje' },
            { status: 404 }
          );
      }
    }

    return NextResponse.json(
      { error: 'Wewnętrzny błąd serwera' },
      { status: 500 }
    );
  }
}
