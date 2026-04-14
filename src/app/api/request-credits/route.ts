import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, reason, requestedAmountUsdc } = body;

    // Validate required fields
    if (!email || !reason || !requestedAmountUsdc) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: email, reason, requestedAmountUsdc' 
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

    // Validate reason length (minimum 10 characters)
    if (reason.length < 10) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Reason must be at least 10 characters long' 
        },
        { status: 400 }
      );
    }

    // Validate amount (between 5 and 50 USDC)
    if (requestedAmountUsdc < 5 || requestedAmountUsdc > 50) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Requested amount must be between 5 and 50 USDC' 
        },
        { status: 400 }
      );
    }

    // Call Locus API to request credits
    const locusResponse = await fetch('https://api.paywithlocus.com/api/gift-code-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        reason,
        requestedAmountUsdc
      })
    });

    if (!locusResponse.ok) {
      const errorData = await locusResponse.text();
      console.error('Locus API error:', errorData);
      
      if (locusResponse.status === 429) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Rate limit exceeded: 1 request per email address per 24 hours' 
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to request credits from Locus API' 
        },
        { status: 500 }
      );
    }

    const locusData = await locusResponse.json();

    return NextResponse.json({
      success: true,
      data: locusData.data,
      message: locusData.message || 'Gift code request submitted successfully. The Locus team will review it shortly.'
    });

  } catch (error) {
    console.error('Credit request error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
