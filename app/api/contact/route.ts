import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, address } = body;
    
    // Validate required fields
    if (!phone || !email) {
      return NextResponse.json(
        { error: 'Phone and email are required' },
        { status: 400 }
      );
    }
    
    // In production, you would:
    // 1. Send email notification using a service like SendGrid, Resend, etc.
    // 2. Store in a database
    // 3. Integrate with CRM
    
    // For now, just log the submission
    console.log('Contact form submission:', {
      name,
      phone,
      email,
      address,
      timestamp: new Date().toISOString()
    });
    
    // For Cloudflare deployment, you could use Cloudflare Email Workers
    // or integrate with a third-party email service
    
    return NextResponse.json({ 
      success: true,
      message: 'Contact form submitted successfully' 
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}