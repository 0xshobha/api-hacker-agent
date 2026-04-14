import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      token, 
      projectId, 
      environmentId, 
      name, 
      sourceType, 
      sourceConfig,
      runtimeConfig,
      autoDeploy = false 
    } = body;

    if (!token || !projectId || !environmentId || !name || !sourceType) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: token, projectId, environmentId, name, sourceType' 
        },
        { status: 400 }
      );
    }

    // Validate source type
    const validSourceTypes = ['image', 'github', 'git'];
    if (!validSourceTypes.includes(sourceType)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid source type. Must be: image, github, or git' 
        },
        { status: 400 }
      );
    }

    // Build service configuration
    const serviceData: any = {
      projectId,
      environmentId,
      name,
      source: {
        type: sourceType
      },
      runtime: {
        port: 8080,
        cpu: runtimeConfig?.cpu || 256,
        memory: runtimeConfig?.memory || 512,
        minInstances: runtimeConfig?.minInstances || 1,
        maxInstances: runtimeConfig?.maxInstances || 3,
        ...(runtimeConfig?.healthCheckPath && { healthCheckPath: runtimeConfig.healthCheckPath })
      },
      autoDeploy
    };

    // Add source-specific configuration
    if (sourceType === 'image') {
      if (!sourceConfig?.imageUri) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Missing required field for image source: imageUri' 
          },
          { status: 400 }
        );
      }
      serviceData.source.imageUri = sourceConfig.imageUri;
    } else if (sourceType === 'github') {
      if (!sourceConfig?.repo) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Missing required field for GitHub source: repo' 
          },
          { status: 400 }
        );
      }
      serviceData.source.repo = sourceConfig.repo;
      serviceData.source.branch = sourceConfig.branch || 'main';
      
      if (sourceConfig?.buildConfig) {
        serviceData.buildConfig = sourceConfig.buildConfig;
      }
    }

    // Create service
    const response = await fetch('https://api.buildwithlocus.com/v1/services', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(serviceData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Locus service creation error:', errorData);
      
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
            error: 'Insufficient credits to create service ($0.25/month required)' 
          },
          { status: 402 }
        );
      }

      if (response.status === 404) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Project or environment not found' 
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to create service' 
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
        url: data.url,
        projectId: data.projectId,
        environmentId: data.environmentId,
        source: data.source,
        runtime: data.runtime,
        createdAt: data.createdAt
      }
    });

  } catch (error) {
    console.error('Locus service error:', error);
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

    // List services
    const response = await fetch(`https://api.buildwithlocus.com/v1/projects/${projectId}/services`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Locus services list error:', errorData);
      
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
          error: 'Failed to list services' 
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: {
        services: data.services || []
      }
    });

  } catch (error) {
    console.error('Locus services error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
