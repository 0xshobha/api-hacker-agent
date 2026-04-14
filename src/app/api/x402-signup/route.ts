import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, chain, email } = body;

    // Validate required fields
    if (!walletAddress || !chain) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: walletAddress, chain' 
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

    // Validate wallet address format (basic ETH address validation)
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

    // Call Locus x402 sign-up endpoint
    const locusResponse = await fetch('https://api.buildwithlocus.com/v1/auth/x402-sign-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        walletAddress,
        chain: chain.toLowerCase(),
        email
      })
    });

    if (locusResponse.status === 402) {
      // Payment required - return x402 challenge details
      const paymentHeaders = {
        'Payment-Required': locusResponse.headers.get('Payment-Required') || 'true',
        'Payment-Address': locusResponse.headers.get('Payment-Address') || '',
        'Payment-Amount': locusResponse.headers.get('Payment-Amount') || '',
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
        message: 'Payment required to complete sign-up. Please complete the payment and retry.'
      }, { 
        status: 402,
        headers: paymentHeaders
      });
    }

    if (!locusResponse.ok) {
      const errorData = await locusResponse.text();
      console.error('Locus x402 sign-up error:', errorData);
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to sign up with x402 protocol' 
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
        isNewWorkspace: locusData.isNewWorkspace,
        accountType: locusData.accountType,
        workspaceId: locusData.workspaceId,
        claimUrl: locusData.claimUrl,
        initialCredits: 6.00
      },
      message: 'Successfully signed up with x402 protocol!'
    });

  } catch (error) {
    console.error('x402 sign-up error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
