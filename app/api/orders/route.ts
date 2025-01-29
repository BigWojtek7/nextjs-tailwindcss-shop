import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/authOptions';
import { prisma } from '@/app/lib/prisma';
import type { Prisma } from '@prisma/client';

import type { OrderData } from '@/app/lib/definitions';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Weryfikacja sesji
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Wymagane uwierzytelnienie' },
        { status: 401 }
      );
    }

    // Walidacja danych wejściowych
    const body = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Nieprawidłowy format danych' },
        { status: 400 }
      );
    }

    const data = body as OrderData;
    
    // Rozszerzona walidacja
    if (!Array.isArray(data.items) || data.items.length === 0 || 
        typeof data.total !== 'number' || data.total <= 0) {
      return NextResponse.json(
        { success: false, error: 'Niekompletne dane zamówienia' },
        { status: 400 }
      );
    }

    // Walidacja poszczególnych produktów
    for (const item of data.items) {
      if (!item.name || typeof item.price !== 'number' || 
          typeof item.quantity !== 'number' || item.quantity <= 0) {
        return NextResponse.json(
          { success: false, error: 'Nieprawidłowy format produktu' },
          { status: 400 }
        );
      }
    }

    // Tworzenie zamówienia z transakcją
    const order = await prisma.$transaction(async (prisma:  Prisma.TransactionClient) => {
      const order = await prisma.order.create({
        data: {
          userId: session.user.id,
          total: data.total,
          status: 'COMPLETED',
          items: {
            create: data.items.map(item => ({
              productId: String(item.id),
              name: item.name.trim(),
              price: item.price,
              quantity: item.quantity,
              image: item.image || '',
            })),
          },
        },
        include: { items: true },
      });

      // Tutaj możesz dodać dodatkowe operacje np. aktualizację stanów magazynowych
      return order;
    });

    return NextResponse.json({
      success: true,
      message: 'Zamówienie zostało utworzone',
      orderId: order.id,
    });

  } catch (error) {
    console.error('Order creation error:', error instanceof Error ? error.message : 'Unknown error');
    
    return NextResponse.json(
      { 
        success: false, 
        error: process.env.NODE_ENV === 'development' 
          ? error instanceof Error ? error.message : 'Unknown error'
          : 'Wystąpił błąd podczas tworzenia zamówienia' 
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Wymagane uwierzytelnienie' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get('limit')) || 10;
    const page = Number(searchParams.get('page')) || 1;

    // Paginacja i sortowanie
    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
    });

    const totalOrders = await prisma.order.count({
      where: { userId: session.user.id },
    });

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        total: totalOrders,
        page,
        totalPages: Math.ceil(totalOrders / limit),
      },
    });

  } catch (error) {
    console.error('Orders fetch error:', error instanceof Error ? error.message : 'Unknown error');
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Wystąpił błąd podczas pobierania zamówień' 
      },
      { status: 500 }
    );
  }
}