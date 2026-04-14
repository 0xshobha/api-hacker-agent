import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, walletId, jwtToken } = body;

    // Validate required fields
    if (!code || !walletId || !jwtToken) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: code, walletId, jwtToken' 
        },
        { status: 400 }
      );
    }

    // Validate code format (XXX-XXX-XXX-XXX)
    const codeRegex = /^[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{3}$/;
    if (!codeRegex.test(code)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid code format. Expected format: XXX-XXX-XXX-XXX' 
        },
        { status: 400 }
      );
    }

    // Call Locus API to redeem credits
    const locusResponse = await fetch('https://api.paywithlocus.com/api/users/redeem-code', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        walletId
      })
    });

    if (!locusResponse.ok) {
      const errorData = await locusResponse.text();
      console.error('Locus redemption API error:', errorData);
      
      if (locusResponse.status === 401) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid or expired JWT token. Please log in to your Locus account.' 
          },
          { status: 401 }
        );
      }

      if (locusResponse.status === 400) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid redemption code or wallet ID' 
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to redeem credits from Locus API' 
        },
        { status: 500 }
      );
    }

    const locusData = await locusResponse.json();

    return NextResponse.json({
      success: true,
      data: locusData.data,
      message: 'Credits successfully redeemed and added to your wallet!'
    });

  } catch (error) {
    console.error('Credit redemption error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
