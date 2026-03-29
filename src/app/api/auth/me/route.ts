import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json(null, { status: 401 });
  }
  return NextResponse.json({
    userId: session.userId,
    role: session.role,
    email: session.email,
    vendorId: session.vendorId,
    wholesalerId: session.wholesalerId,
  });
}
