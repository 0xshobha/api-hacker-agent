import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, projectId, name, type } = body;

    if (!token || !projectId || !name || !type) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: token, projectId, name, type' 
        },
        { status: 400 }
      );
    }

    // Validate environment type
    const validTypes = ['development', 'staging', 'production'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid environment type. Must be: development, staging, or production' 
        },
        { status: 400 }
      );
    }

    // Create environment
    const envData = {
      name,
      type
    };

    const response = await fetch(`https://api.buildwithlocus.com/v1/projects/${projectId}/environments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(envData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Locus environment creation error:', errorData);
      
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
            error: 'Project not found' 
          },
          { status: 404 }
        );
      }

      if (response.status === 402) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Insufficient credits to create environment' 
          },
          { status: 402 }
        );
      }

      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to create environment' 
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        name: data.name,
        type: data.type,
        projectId: data.projectId
      }
    });

  } catch (error) {
    console.error('Locus environment error:', error);
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
    const projectId = searchParams.get('projectId');

    if (!token || !projectId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: token, projectId' 
        },
        { status: 400 }
      );
    }

    // List environments
    const response = await fetch(`https://api.buildwithlocus.com/v1/projects/${projectId}/environments`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Locus environments list error:', errorData);
      
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
            error: 'Project not found' 
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to list environments' 
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: {
        environments: data.environments || []
      }
    });

  } catch (error) {
    console.error('Locus environments error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
