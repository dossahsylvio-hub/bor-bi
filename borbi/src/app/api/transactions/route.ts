import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionFromRequest } from '@/lib/auth';

const transactionSchema = z.object({
  clientId: z.string().min(1),
  clientName: z.string().min(1),
  items: z.array(z.object({
    productId: z.string(),
    productName: z.string(),
    quantity: z.number().positive(),
    priceCents: z.number().positive(),
  })),
  totalCents: z.number().positive(),
  amountPaid: z.number().min(0),
  paymentStatus: z.enum(['PAID', 'PARTIAL', 'UNPAID']),
});

// Platform fee rate: 0.5%
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

  // Only vendors and admins can create transactions
  if (session.role !== 'VENDOR' && session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Accès refusé — réservé aux vendeurs' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const data = transactionSchema.parse(body);

    const remaining = data.totalCents - data.amountPaid;
    const platformFeeCents = Math.round(data.totalCents * PLATFORM_FEE_RATE);

    // Data isolation: use vendorId from session, not from request body
    const vendorId = session.vendorId || session.userId;

    const transaction = {
      id: `txn-${Date.now()}`,
      vendorId,
      clientId: data.clientId,
      items: data.items,
      totalCents: data.totalCents,
      amountPaid: data.amountPaid,
      remaining,
      paymentStatus: data.paymentStatus,
      platformFeeCents,
      hash: `hash-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      createdAt: new Date().toISOString(),
    };

    // Commission record
    const commission = {
      id: `comm-${Date.now()}`,
      type: 'SALE',
      transactionId: transaction.id,
      amountCents: platformFeeCents,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    // Payment record for partial/unpaid
    const paymentRecord = data.paymentStatus !== 'PAID' ? {
      id: `pay-${Date.now()}`,
      transactionId: transaction.id,
      amountCents: data.amountPaid,
      previousDebt: 0,
      newDebt: remaining,
      createdAt: new Date().toISOString(),
    } : null;

    // Invalidate cache for this vendor
    cache.delete(`transactions:${vendorId}`);

    return NextResponse.json({
      ...transaction,
      commission,
      payment: paymentRecord,
    }, { status: 201 });
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
  // - VENDOR: only their own transactions (filtered by vendorId)
  // - WHOLESALER: no access to vendor transactions
  // - ADMIN: read all
  if (session.role === 'WHOLESALER') {
    return NextResponse.json({ error: 'Accès refusé — les grossistes n\'ont pas accès aux transactions vendeurs' }, { status: 403 });
  }

  const cacheKey = session.role === 'ADMIN' ? 'transactions:admin' : `transactions:${session.vendorId}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  // In production: filter by vendorId from session
  // const where = session.role === 'ADMIN' ? {} : { vendorId: session.vendorId };
  // const transactions = await prisma.transaction.findMany({ where, orderBy: { createdAt: 'desc' }, select: { id: true, totalCents: true, paymentStatus: true, amountPaid: true, remaining: true, platformFeeCents: true, createdAt: true, client: { select: { name: true } } } });
  const transactions: unknown[] = [];
  setCached(cacheKey, transactions);
  return NextResponse.json(transactions);
}

// Add payment to existing transaction
export async function PATCH(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  if (session.role !== 'VENDOR' && session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { transactionId, amountCents } = z.object({
      transactionId: z.string(),
      amountCents: z.number().positive(),
    }).parse(body);

    // In production:
    // const tx = await prisma.transaction.findUnique({ where: { id: transactionId } });
    // if (!tx || (session.role !== 'ADMIN' && tx.vendorId !== session.vendorId)) {
    //   return NextResponse.json({ error: 'Transaction non trouvée ou accès refusé' }, { status: 404 });
    // }
    // const previousDebt = tx.remaining;
    // const newDebt = Math.max(0, previousDebt - amountCents);
    // const newAmountPaid = tx.amountPaid + amountCents;
    // const newStatus = newDebt === 0 ? 'PAID' : 'PARTIAL';
    // await prisma.payment.create({ data: { transactionId, amountCents, previousDebt, newDebt } });
    // await prisma.transaction.update({ where: { id: transactionId }, data: { amountPaid: newAmountPaid, remaining: newDebt, paymentStatus: newStatus } });

    // Invalidate cache
    cache.delete(`transactions:${session.vendorId}`);

    return NextResponse.json({
      transactionId,
      amountCents,
      message: 'Paiement enregistré',
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
