import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionFromRequest } from '@/lib/auth';

const messageSchema = z.object({
  receiverId: z.string().min(1),
  receiverType: z.enum(['vendor', 'wholesaler']),
  content: z.string().min(1).max(1000),
  orderId: z.string().optional(),
});

// In-memory message store (in production: use Prisma)
const messages: Array<{
  id: string;
  senderId: string;
  senderType: string;
  receiverId: string;
  receiverType: string;
  content: string;
  read: boolean;
  orderId?: string;
  createdAt: string;
}> = [];

export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  // Security: only return messages where user is sender or receiver
  const userMessages = messages.filter(m =>
    m.senderId === session.userId || m.receiverId === session.userId
  );

  return NextResponse.json(userMessages);
}

export async function POST(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = messageSchema.parse(body);

    // XSS: React escapes by default, but sanitize content
    const sanitized = data.content.replace(/<[^>]*>/g, '').trim();

    const msg = {
      id: `msg-${Date.now()}`,
      senderId: session.userId,
      senderType: session.role.toLowerCase(),
      receiverId: data.receiverId,
      receiverType: data.receiverType,
      content: sanitized,
      read: false,
      orderId: data.orderId,
      createdAt: new Date().toISOString(),
    };

    messages.push(msg);

    return NextResponse.json(msg, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
