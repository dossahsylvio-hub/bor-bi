import { NextRequest } from 'next/server';

export interface SessionUser {
  userId: string;
  role: 'ADMIN' | 'VENDOR' | 'WHOLESALER';
  email: string;
  vendorId?: string;
  wholesalerId?: string;
}

export function getSessionFromRequest(request: NextRequest): SessionUser | null {
  try {
    const sessionCookie = request.cookies.get('borbi_session');
    if (!sessionCookie) return null;
    const session = JSON.parse(sessionCookie.value) as SessionUser;
    if (!session.userId || !session.role) return null;
    return session;
  } catch {
    return null;
  }
}

export function requireAuth(request: NextRequest): SessionUser {
  const session = getSessionFromRequest(request);
  if (!session) throw new Error('UNAUTHORIZED');
  return session;
}

export function requireAdmin(request: NextRequest): SessionUser {
  const session = requireAuth(request);
  if (session.role !== 'ADMIN') throw new Error('FORBIDDEN');
  return session;
}

// Rate limiting store (in-memory, per process)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, maxRequests = 10, windowMs = 60000): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= maxRequests) return false;
  entry.count++;
  return true;
}

// Demo users for auth without DB
export const DEMO_USERS: Record<string, { passwordHash: string; role: 'ADMIN' | 'VENDOR' | 'WHOLESALER'; id: string; vendorId?: string; wholesalerId?: string }> = {
  'pauledoux@protonmail.com': { passwordHash: 'admin123', role: 'ADMIN', id: 'admin-1' },
  'vendeur@bor-bi.com': { passwordHash: 'vendor123', role: 'VENDOR', id: 'vendor-demo-1', vendorId: 'vendor-demo-1' },
  'grossiste@bor-bi.com': { passwordHash: 'wholesaler123', role: 'WHOLESALER', id: 'wholesaler-demo-1', wholesalerId: 'wholesaler-demo-1' },
  // Legacy accounts
  'demo@borbi.sn': { passwordHash: 'Demo@2026!', role: 'VENDOR', id: 'vendor-1', vendorId: 'vendor-1' },
  'grossiste@borbi.sn': { passwordHash: 'Grossiste@2026!', role: 'WHOLESALER', id: 'wholesaler-1', wholesalerId: 'wholesaler-1' },
};
