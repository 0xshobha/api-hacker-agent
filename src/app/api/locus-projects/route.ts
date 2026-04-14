import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, name, description, region } = body;

    if (!token || !name) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: token, name' 
        },
        { status: 400 }
      );
    }

    // Create project
    const projectData = {
      name,
      description: description || '',
      ...(region && { region })
    };

    const response = await fetch('https://api.buildwithlocus.com/v1/projects', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Locus project creation error:', errorData);
      
      if (response.status === 401) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid or expired token' 
          },
          { status: 401 }
        );
      }

      if (response.status === 402) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Insufficient credits to create project' 
          },
          { status: 402 }
        );
      }

      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to create project' 
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
        description: data.description,
        region: data.region,
        workspaceId: data.workspaceId,
        createdAt: data.createdAt
      }
    });

  } catch (error) {
    console.error('Locus project error:', error);
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

    if (!token) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required field: token' 
        },
        { status: 400 }
      );
    }

    // List projects
    const response = await fetch('https://api.buildwithlocus.com/v1/projects', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Locus projects list error:', errorData);
      
      if (response.status === 401) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid or expired token' 
          },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to list projects' 
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: {
        projects: data.projects || []
      }
    });

  } catch (error) {
    console.error('Locus projects error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
