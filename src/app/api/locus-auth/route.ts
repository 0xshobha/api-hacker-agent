import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey } = body;

    if (!apiKey) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required field: apiKey' 
        },
        { status: 400 }
      );
    }

    // Validate API key format
    if (!apiKey.startsWith('claw_dev_')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid API key format. Must start with claw_dev_' 
        },
        { status: 400 }
      );
    }

    // Exchange API key for JWT token
    const response = await fetch('https://api.buildwithlocus.com/v1/auth/exchange', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ apiKey }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Locus auth error:', errorData);
      
      if (response.status === 401) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid API key' 
          },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to exchange API key for JWT token' 
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: {
        token: data.token,
        expiresIn: data.expiresIn || '30d',
        workspaceId: data.workspaceId
      }
    });

  } catch (error) {
    console.error('Locus auth error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
