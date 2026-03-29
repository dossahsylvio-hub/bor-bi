import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionFromRequest } from '@/lib/auth';

const orderSchema = z.object({
  wholesalerId: z.string().min(1),
  items: z.array(z.object({
    productId: z.string(),
    productName: z.string(),
    quantity: z.number().positive(),
    priceCents: z.number().positive(),
    conditioning: z.string().optional(),
  })),
  totalCents: z.number().positive(),
});

const PLATFORM_FEE_RATE = parseFloat(process.env.PLATFORM_FEE_RATE || '0.005');

// In-memory cache (5 min TTL)
const cache = new Map<string, { data: unknown; expiresAt: number }>();
function getCached(key: string): unknown | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { cache.delete(key); return null; }
  return entry.data;
}
function setCached(key: string, data: unknown, ttlMs = 300000) {
  cache.set(key, { data, expiresAt: Date.now() + ttlMs });
}

export async function POST(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  // Only vendors can place orders
  if (session.role !== 'VENDOR' && session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Accès refusé — réservé aux vendeurs' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const data = orderSchema.parse(body);

    const platformFeeCents = Math.round(data.totalCents * PLATFORM_FEE_RATE);

    // Use vendorId from session (data isolation)
    const vendorId = session.vendorId || session.userId;

    const order = {
      id: `ord-${Date.now()}`,
      vendorId,
      wholesalerId: data.wholesalerId,
      items: data.items,
      totalCents: data.totalCents,
      platformFeeCents,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    const commission = {
      id: `comm-ord-${Date.now()}`,
      type: 'ORDER',
      orderId: order.id,
      amountCents: platformFeeCents,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    // Invalidate cache
    cache.delete(`orders:vendor:${vendorId}`);
    cache.delete(`orders:wholesaler:${data.wholesalerId}`);

    return NextResponse.json({ ...order, commission }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  // Strict data isolation:
  // - VENDOR: only their own orders
  // - WHOLESALER: only orders placed with them
  // - ADMIN: all orders
  let cacheKey = 'orders:admin';
  if (session.role === 'VENDOR') {
    cacheKey = `orders:vendor:${session.vendorId}`;
  } else if (session.role === 'WHOLESALER') {
    cacheKey = `orders:wholesaler:${session.wholesalerId}`;
  }

  const cached = getCached(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  // In production:
  // let where = {};
  // if (session.role === 'VENDOR') where = { vendorId: session.vendorId };
  // else if (session.role === 'WHOLESALER') where = { wholesalerId: session.wholesalerId };
  // const orders = await prisma.order.findMany({ where, orderBy: { createdAt: 'desc' }, select: { id: true, status: true, totalCents: true, platformFeeCents: true, createdAt: true, items: true } });
  const orders: unknown[] = [];
  setCached(cacheKey, orders);
  return NextResponse.json(orders);
}

export async function PATCH(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  // Only wholesalers and admins can update order status
  if (session.role !== 'WHOLESALER' && session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Accès refusé — réservé aux grossistes' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { orderId, status } = z.object({
      orderId: z.string(),
      status: z.enum(['CONFIRMED', 'DELIVERED', 'CANCELLED']),
    }).parse(body);

    // In production: verify order belongs to this wholesaler
    // const order = await prisma.order.findUnique({ where: { id: orderId } });
    // if (!order || (session.role !== 'ADMIN' && order.wholesalerId !== session.wholesalerId)) {
    //   return NextResponse.json({ error: 'Commande non trouvée ou accès refusé' }, { status: 404 });
    // }
    // await prisma.order.update({ where: { id: orderId }, data: { status } });

    // Invalidate cache
    cache.delete(`orders:wholesaler:${session.wholesalerId}`);

    return NextResponse.json({
      id: orderId,
      status,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
