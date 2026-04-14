import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, email } = body;

    // Validate required fields
    if (!token || !email) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: token, email' 
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid email format' 
        },
        { status: 400 }
      );
    }

    // Call Locus claim redemption endpoint
    const locusResponse = await fetch('https://api.buildwithlocus.com/v1/auth/claim-redeem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        email
      })
    });

    if (!locusResponse.ok) {
      const errorData = await locusResponse.text();
      console.error('Locus claim redemption error:', errorData);
      
      if (locusResponse.status === 400) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid or expired claim token' 
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to redeem claim token' 
        },
        { status: locusResponse.status }
      );
    }

    const locusData = await locusResponse.json();

    return NextResponse.json({
      success: true,
      data: {
        email: locusData.email,
        loginUrl: locusData.loginUrl,
        workspaceId: locusData.workspaceId
      },
      message: 'Claim token successfully redeemed! Check your email for login instructions.'
    });

  } catch (error) {
    console.error('Claim redemption error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
