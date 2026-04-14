import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, serviceId } = body;

    if (!token || !serviceId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: token, serviceId' 
        },
        { status: 400 }
      );
    }

    // Trigger deployment
    const response = await fetch('https://api.buildwithlocus.com/v1/deployments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ serviceId }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Locus deployment trigger error:', errorData);
      
      if (response.status === 401) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid or expired token' 
          },
          { status: 401 }
        );
      }

      if (response.status === 404) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Service not found' 
          },
          { status: 404 }
        );
      }

      if (response.status === 402) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Insufficient credits for deployment' 
          },
          { status: 402 }
        );
      }

      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to trigger deployment' 
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        serviceId: data.serviceId,
        version: data.version,
        status: data.status,
        source: data.source,
        createdAt: data.createdAt,
        estimatedTime: data.source?.type === 'github' ? '3-7 minutes' : '1-2 minutes'
      }
    });

  } catch (error) {
    console.error('Locus deployment error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const deploymentId = searchParams.get('deploymentId');
    const serviceId = searchParams.get('serviceId');

    if (!token) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required field: token' 
        },
        { status: 400 }
      );
    }

    let url = 'https://api.buildwithlocus.com/v1/deployments';
    
    if (deploymentId) {
      url = `https://api.buildwithlocus.com/v1/deployments/${deploymentId}`;
    } else if (serviceId) {
      url = `https://api.buildwithlocus.com/v1/services/${serviceId}/deployments`;
    }

    // Get deployment(s)
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Locus deployment status error:', errorData);
      
      if (response.status === 401) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid or expired token' 
          },
          { status: 401 }
        );
      }

      if (response.status === 404) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Deployment or service not found' 
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to get deployment status' 
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: deploymentId ? data : { deployments: data.deployments || [] }
    });

  } catch (error) {
    console.error('Locus deployment status error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
