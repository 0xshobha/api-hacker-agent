import { NextRequest, NextResponse } from 'next/server';

const LASO_BASE_URL = 'https://agents.laso.finance';

// Helper to handle x402 payment challenges
async function handleLasoRequest(
  endpoint: string,
  method: 'GET' | 'POST' = 'GET',
  body?: object,
  walletAddress?: string
) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (walletAddress) {
    headers['X-Wallet-Address'] = walletAddress;
  }

  const response = await fetch(`${LASO_BASE_URL}${endpoint}`, {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  });

  // Handle x402 payment required (402 status)
  if (response.status === 402) {
    const paymentHeaders = {
      'Payment-Required': response.headers.get('Payment-Required') || 'true',
      'Payment-Address': response.headers.get('Payment-Address') || '',
      'Payment-Amount': response.headers.get('Payment-Amount') || '',
      'Payment-Token': response.headers.get('Payment-Token') || '',
      'Payment-Chain': response.headers.get('Payment-Chain') || 'base',
      'Payment-Facilitator': response.headers.get('Payment-Facilitator') || 'facilitator.payai.network',
    };

    return {
      success: false,
      paymentRequired: true,
      paymentDetails: paymentHeaders,
      message: 'Payment required to complete this operation',
    };
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Laso API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return { success: true, data };
}

// GET /api/laso - Get auth credentials or browse catalog
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const walletAddress = searchParams.get('walletAddress');

    if (!action) {
      return NextResponse.json(
        { success: false, error: 'Missing action parameter' },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'auth':
        // Get auth credentials ($0.001 USDC)
        result = await handleLasoRequest('/auth', 'GET', undefined, walletAddress || undefined);
        break;

      case 'search-gift-cards':
        // Browse gift card catalog (Free)
        const query = searchParams.get('query') || '';
        result = await handleLasoRequest(`/search-gift-cards?q=${encodeURIComponent(query)}`);
        break;

      case 'get-card-data':
        // Poll for card details (Free)
        const cardId = searchParams.get('cardId');
        if (!cardId) {
          return NextResponse.json(
            { success: false, error: 'Missing cardId parameter' },
            { status: 400 }
          );
        }
        result = await handleLasoRequest(`/get-card-data?cardId=${encodeURIComponent(cardId)}`);
        break;

      case 'get-auth-link':
        // Get dashboard login link (Free)
        result = await handleLasoRequest('/get-auth-link');
        break;

      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Laso GET error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/laso - Perform payment operations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, walletAddress, ...params } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, error: 'Missing action parameter' },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'get-card':
        // Order a prepaid card ($5-$1000 USDC)
        if (!params.amount || params.amount < 5 || params.amount > 1000) {
          return NextResponse.json(
            { success: false, error: 'Amount must be between $5 and $1000' },
            { status: 400 }
          );
        }
        result = await handleLasoRequest(
          `/get-card?amount=${params.amount}`,
          'GET',
          undefined,
          walletAddress
        );
        break;

      case 'send-payment':
        // Send Venmo or PayPal payment ($5-$1000 USDC)
        if (!params.amount || params.amount < 5 || params.amount > 1000) {
          return NextResponse.json(
            { success: false, error: 'Amount must be between $5 and $1000' },
            { status: 400 }
          );
        }
        if (!params.recipient) {
          return NextResponse.json(
            { success: false, error: 'Missing recipient parameter' },
            { status: 400 }
          );
        }
        if (!params.platform || !['venmo', 'paypal'].includes(params.platform)) {
          return NextResponse.json(
            { success: false, error: 'Platform must be venmo or paypal' },
            { status: 400 }
          );
        }
        result = await handleLasoRequest(
          `/send-payment?amount=${params.amount}&recipient=${encodeURIComponent(params.recipient)}&platform=${params.platform}`,
          'GET',
          undefined,
          walletAddress
        );
        break;

      case 'order-gift-card':
        // Order a gift card ($5-$9000 USDC)
        if (!params.amount || params.amount < 5 || params.amount > 9000) {
          return NextResponse.json(
            { success: false, error: 'Amount must be between $5 and $9000' },
            { status: 400 }
          );
        }
        if (!params.cardId) {
          return NextResponse.json(
            { success: false, error: 'Missing cardId parameter' },
            { status: 400 }
          );
        }
        result = await handleLasoRequest(
          `/order-gift-card?amount=${params.amount}&cardId=${encodeURIComponent(params.cardId)}`,
          'GET',
          undefined,
          walletAddress
        );
        break;

      case 'push-to-card':
        // Send to U.S. debit card ($10-$9541.98 USDC)
        if (!params.amount || params.amount < 10 || params.amount > 9541.98) {
          return NextResponse.json(
            { success: false, error: 'Amount must be between $10 and $9541.98' },
            { status: 400 }
          );
        }
        if (!params.cardNumber) {
          return NextResponse.json(
            { success: false, error: 'Missing cardNumber parameter' },
            { status: 400 }
          );
        }
        result = await handleLasoRequest(
          `/push-to-card?amount=${params.amount}&cardNumber=${encodeURIComponent(params.cardNumber)}`,
          'GET',
          undefined,
          walletAddress
        );
        break;

      case 'refresh-auth':
        // Refresh expired token (Free)
        if (!params.token) {
          return NextResponse.json(
            { success: false, error: 'Missing token parameter' },
            { status: 400 }
          );
        }
        result = await handleLasoRequest('/auth', 'POST', { token: params.token });
        break;

      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Laso POST error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
