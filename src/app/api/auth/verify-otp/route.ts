import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const verifyOtpSchema = z.object({
  phone: z.string().min(8),
  code: z.string().length(6),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, code } = verifyOtpSchema.parse(body);

    // In production: verify against DB OtpCode table
    // For demo: accept any 6-digit code
    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      return NextResponse.json({ error: 'Code OTP invalide' }, { status: 401 });
    }

    // Look up user by phone
    const userId = `user-phone-${phone}`;
    const role = 'VENDOR'; // Default role for phone login

    const response = NextResponse.json({
      success: true,
      role,
      userId,
    });

    response.cookies.set('borbi_session', JSON.stringify({ userId, role, phone }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erreur vérification OTP' }, { status: 500 });
  }
}
