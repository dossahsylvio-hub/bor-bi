import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/auth';

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const registerSchema = z.object({
  email: z.string().optional().refine(
    (val) => !val || emailRegex.test(val),
    { message: 'Adresse email invalide. Vérifiez le format (ex: nom@domaine.com)' }
  ),
  phone: z.string().optional(),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  businessName: z.string().min(2, 'Nom requis'),
  businessType: z.string().optional(),
  role: z.enum(['VENDOR', 'WHOLESALER']),
  location: z.string().optional(),
  country: z.string().optional(),
  currency: z.string().default('XOF'),
  phoneWithCode: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (!checkRateLimit(`register:${ip}`, 5, 60000)) {
    return NextResponse.json({ error: 'Trop de tentatives. Réessayez dans 1 minute.' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const data = registerSchema.parse(body);

    if (!data.email && !data.phone && !data.phoneWithCode) {
      return NextResponse.json({ error: 'Email ou téléphone requis' }, { status: 400 });
    }

    // Validate email format explicitly
    if (data.email && !emailRegex.test(data.email)) {
      return NextResponse.json({
        error: 'Adresse email invalide. Vérifiez le format (ex: nom@domaine.com)'
      }, { status: 400 });
    }

    // Require businessType for vendors
    if (data.role === 'VENDOR' && !data.businessType) {
      return NextResponse.json({
        error: 'Le type de boutique est obligatoire pour les vendeurs'
      }, { status: 400 });
    }

    const userId = `user-${Date.now()}`;
    const vendorId = data.role === 'VENDOR' ? `vendor-${Date.now()}` : undefined;
    const wholesalerId = data.role === 'WHOLESALER' ? `wholesaler-${Date.now()}` : undefined;

    const sessionData = {
      userId,
      role: data.role,
      email: data.email,
      vendorId,
      wholesalerId,
      businessType: data.businessType,
      country: data.country,
    };

    const response = NextResponse.json({
      success: true,
      role: data.role,
      userId,
      businessType: data.businessType,
      message: 'Compte créé avec succès',
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
      const firstError = error.errors[0];
      return NextResponse.json({
        error: firstError.message || 'Données invalides',
        details: error.errors
      }, { status: 400 });
    }
    return NextResponse.json({ error: "Erreur lors de l'inscription" }, { status: 500 });
  }
}
