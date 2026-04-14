import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, walletAddress, chain, jwtToken } = body;

    // Validate required fields
    if (!amount || !walletAddress || !chain || !jwtToken) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: amount, walletAddress, chain, jwtToken' 
        },
        { status: 400 }
      );
    }

    // Validate amount range
    if (amount < 1.00 || amount > 100.00) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Amount must be between $1.00 and $100.00' 
        },
        { status: 400 }
      );
    }

    // Validate chain
    if (!['polygon', 'base'].includes(chain.toLowerCase())) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid chain. Must be "polygon" or "base"' 
        },
        { status: 400 }
      );
    }

    // Validate wallet address format
    const addressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!addressRegex.test(walletAddress)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid wallet address format' 
        },
        { status: 400 }
      );
    }

    // Call Locus x402 top-up endpoint
    const locusResponse = await fetch('https://api.buildwithlocus.com/v1/billing/x402-top-up', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        walletAddress,
        chain: chain.toLowerCase()
      })
    });

    if (locusResponse.status === 402) {
      // Payment required - return x402 challenge details
      const paymentHeaders = {
        'Payment-Required': locusResponse.headers.get('Payment-Required') || 'true',
        'Payment-Address': locusResponse.headers.get('Payment-Address') || '',
        'Payment-Amount': locusResponse.headers.get('Payment-Amount') || amount.toString(),
        'Payment-Token': locusResponse.headers.get('Payment-Token') || '',
        'Payment-Chain': locusResponse.headers.get('Payment-Chain') || chain,
        'Payment-Facilitator': locusResponse.headers.get('Payment-Facilitator') || 'facilitator.payai.network',
        'Payment-Currency': locusResponse.headers.get('Payment-Currency') || 'USDC',
      };

      return NextResponse.json({
        success: false,
        error: 'Payment required',
        paymentRequired: true,
        paymentDetails: paymentHeaders,
        message: `Payment of $${amount} USDC required to complete top-up. Please complete the payment and retry.`
      }, { 
        status: 402,
        headers: paymentHeaders
      });
    }

    if (!locusResponse.ok) {
      const errorData = await locusResponse.text();
      console.error('Locus x402 top-up error:', errorData);
      
      if (locusResponse.status === 401) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid or expired JWT token' 
          },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to top-up credits with x402 protocol' 
        },
        { status: locusResponse.status }
      );
    }

    const locusData = await locusResponse.json();

    return NextResponse.json({
      success: true,
      data: {
        jwt: locusData.jwt,
        expiresIn: locusData.expiresIn,
        creditBalance: locusData.creditBalance,
        workspaceId: locusData.workspaceId,
        amountAdded: amount
      },
      message: `Successfully topped up $${amount} USDC!`
    });

  } catch (error) {
    console.error('x402 top-up error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
