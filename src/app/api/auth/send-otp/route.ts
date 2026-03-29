import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const sendOtpSchema = z.object({
  phone: z.string().min(8),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone } = sendOtpSchema.parse(body);

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // In production: save OTP to DB with expiry, send via Twilio
    // Twilio integration hook (disabled until keys provided):
    // if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    //   const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    //   await client.messages.create({ body: `Votre code Bor-Bi: ${code}`, from: process.env.TWILIO_PHONE_NUMBER, to: phone });
    // }

    console.log(`[OTP] Phone: ${phone}, Code: ${code}`); // Dev only

    return NextResponse.json({
      success: true,
      message: 'Code OTP envoyé',
      // In dev, return code for testing (remove in production)
      ...(process.env.NODE_ENV === 'development' && { devCode: code }),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Numéro de téléphone invalide' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erreur envoi OTP' }, { status: 500 });
  }
}
