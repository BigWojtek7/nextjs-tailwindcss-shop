import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/app/lib/prisma';

interface OrderItem {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface OrderData {
  items: OrderItem[];
  total: number;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session:', session);

    if (!session?.user?.id) {
      console.log('No session or user ID');
      return NextResponse.json(
        { error: 'Musisz być zalogowany' },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log('Request body:', body);

    const data = body as OrderData;

    if (!data.items?.length || typeof data.total !== 'number') {
      console.log('Invalid order data:', data);
      return NextResponse.json(
        { error: 'Nieprawidłowe dane zamówienia' },
        { status: 400 }
      );
    }

    console.log('Creating order for user:', session.user.id);
    console.log('Order data:', {
      userId: session.user.id,
      total: data.total,
      itemsCount: data.items.length,
    });

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total: data.total,
        status: 'COMPLETED',
        items: {
          create: data.items.map((item) => ({
            productId: String(item.id),
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    console.log('Order created:', order);

    return NextResponse.json({
      success: true,
      message: 'Zamówienie zostało utworzone',
      order,
    });
  } catch (error) {
    console.error('Order creation error:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      error,
    });

    return NextResponse.json(
      { success: false, error: 'Wystąpił błąd podczas tworzenia zamówienia' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Musisz być zalogowany' },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Wystąpił błąd podczas pobierania zamówień' },
      { status: 500 }
    );
  }
}
