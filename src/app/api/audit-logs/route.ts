import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';

const auditLogSchema = z.object({
  userId: z.string(),
  userEmail: z.string().email(),
  action: z.string(),
  details: z.unknown().optional(),
  ip: z.string().optional(),
});

// In-memory store (in production: use Prisma AuditLog model)
const auditLogs: Array<{
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  details?: unknown;
  ip?: string;
  createdAt: string;
}> = [];

export async function POST(request: NextRequest) {
  // Internal endpoint - can be called from server-side
  try {
    const body = await request.json();
    const data = auditLogSchema.parse(body);

    const log = {
      id: `log-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
    };

    auditLogs.push(log);
    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);
    return NextResponse.json(auditLogs);
  } catch {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }
}
