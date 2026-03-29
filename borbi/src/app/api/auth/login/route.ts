import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit, DEMO_USERS } from '@/lib/auth';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  // Rate limiting: 10 requests per minute per IP
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (!checkRateLimit(`auth:${ip}`, 10, 60000)) {
    return NextResponse.json({ error: 'Trop de tentatives. Réessayez dans 1 minute.' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const user = DEMO_USERS[email.toLowerCase()];
    if (!user || user.passwordHash !== password) {
      return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 });
    }

    const sessionData = {
      userId: user.id,
      role: user.role,
      email,
      vendorId: user.vendorId,
      wholesalerId: user.wholesalerId,
    };

    const response = NextResponse.json({
      success: true,
      role: user.role,
      userId: user.id,
      email,
    });

    response.cookies.set('borbi_session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
