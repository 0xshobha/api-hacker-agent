import { NextRequest, NextResponse } from 'next/server';

interface DeployWorkflowRequest {
  apiKey: string;
  projectName: string;
  projectDescription?: string;
  environmentName: string;
  environmentType: 'development' | 'staging' | 'production';
  serviceName: string;
  sourceType: 'image' | 'github' | 'git';
  sourceConfig: {
    imageUri?: string;
    repo?: string;
    branch?: string;
    buildConfig?: {
      method?: string;
      dockerfile?: string;
      buildArgs?: Record<string, string>;
    };
  };
  runtimeConfig?: {
    cpu?: number;
    memory?: number;
    minInstances?: number;
    maxInstances?: number;
    healthCheckPath?: string;
  };
  autoDeploy?: boolean;
  region?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as DeployWorkflowRequest;
    const {
      apiKey,
      projectName,
      projectDescription,
      environmentName,
      environmentType,
      serviceName,
      sourceType,
      sourceConfig,
      runtimeConfig,
      autoDeploy = false,
      region
    } = body;

    if (!apiKey || !projectName || !environmentName || !environmentType || !serviceName || !sourceType || !sourceConfig) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields' 
        },
        { status: 400 }
      );
    }

    const results = [];
    let projectId: string | null = null;
    let environmentId: string | null = null;
    let serviceId: string | null = null;
    let deploymentId: string | null = null;
    let token: string | null = null;

    // Step 1: Exchange API key for JWT token
    results.push({ step: 1, action: 'Exchanging API key for JWT token...', status: 'in_progress' });
    
    try {
      const authResponse = await fetch('http://localhost:3000/api/locus-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey })
      });
      
      const authData = await authResponse.json();
      if (!authData.success) {
        throw new Error(authData.error);
      }
      
      token = authData.data.token;
      results.push({ step: 1, action: 'API key exchanged successfully', status: 'completed', token: token.substring(0, 20) + '...' });
    } catch (error) {
      results.push({ step: 1, action: 'Failed to exchange API key', status: 'failed', error: error instanceof Error ? error.message : 'Unknown error' });
      return NextResponse.json({ success: false, results });
    }

    // Step 2: Create project
    results.push({ step: 2, action: `Creating project "${projectName}"...`, status: 'in_progress' });
    
    try {
      const projectResponse = await fetch('http://localhost:3000/api/locus-projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token, 
          name: projectName, 
          description: projectDescription || '',
          region 
        })
      });
      
      const projectData = await projectResponse.json();
      if (!projectData.success) {
        throw new Error(projectData.error);
      }
      
      projectId = projectData.data.id;
      results.push({ step: 2, action: 'Project created successfully', status: 'completed', projectId });
    } catch (error) {
      results.push({ step: 2, action: 'Failed to create project', status: 'failed', error: error instanceof Error ? error.message : 'Unknown error' });
      return NextResponse.json({ success: false, results });
    }

    // Step 3: Create environment
    results.push({ step: 3, action: `Creating ${environmentType} environment "${environmentName}"...`, status: 'in_progress' });
    
    try {
      const envResponse = await fetch('http://localhost:3000/api/locus-environments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token, 
          projectId: projectId!, 
          name: environmentName, 
          type: environmentType 
        })
      });
      
      const envData = await envResponse.json();
      if (!envData.success) {
        throw new Error(envData.error);
      }
      
      environmentId = envData.data.id;
      results.push({ step: 3, action: 'Environment created successfully', status: 'completed', environmentId });
    } catch (error) {
      results.push({ step: 3, action: 'Failed to create environment', status: 'failed', error: error instanceof Error ? error.message : 'Unknown error' });
      return NextResponse.json({ success: false, results });
    }

    // Step 4: Create service
    results.push({ step: 4, action: `Creating service "${serviceName}" with ${sourceType} source...`, status: 'in_progress' });
    
    try {
      const serviceResponse = await fetch('http://localhost:3000/api/locus-services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token, 
          projectId: projectId!, 
          environmentId: environmentId!, 
          name: serviceName, 
          sourceType, 
          sourceConfig,
          runtimeConfig,
          autoDeploy 
        })
      });
      
      const serviceData = await serviceResponse.json();
      if (!serviceData.success) {
        throw new Error(serviceData.error);
      }
      
      serviceId = serviceData.data.id;
      results.push({ 
        step: 4, 
        action: 'Service created successfully', 
        status: 'completed', 
        serviceId,
        serviceUrl: serviceData.data.url,
        estimatedCost: '$0.25/month'
      });
    } catch (error) {
      results.push({ step: 4, action: 'Failed to create service', status: 'failed', error: error instanceof Error ? error.message : 'Unknown error' });
      return NextResponse.json({ success: false, results });
    }

    // Step 5: Trigger deployment (if not auto-deploy)
    if (!autoDeploy) {
      results.push({ step: 5, action: 'Triggering deployment...', status: 'in_progress' });
      
      try {
        const deployResponse = await fetch('http://localhost:3000/api/locus-deployments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, serviceId: serviceId! })
        });
        
        const deployData = await deployResponse.json();
        if (!deployData.success) {
          throw new Error(deployData.error);
        }
        
        deploymentId = deployData.data.id;
        const estimatedTime = deployData.data.estimatedTime;
        
        results.push({ 
          step: 5, 
          action: 'Deployment triggered successfully', 
          status: 'completed', 
          deploymentId,
          estimatedTime,
          nextAction: 'Monitor deployment status - this will take ' + estimatedTime
        });
      } catch (error) {
        results.push({ step: 5, action: 'Failed to trigger deployment', status: 'failed', error: error instanceof Error ? error.message : 'Unknown error' });
        return NextResponse.json({ success: false, results });
      }
    } else {
      results.push({ 
        step: 5, 
        action: 'Auto-deploy enabled - deployment will trigger automatically', 
        status: 'completed',
        nextAction: 'Monitor deployment status - this will take 3-7 minutes for GitHub builds'
      });
    }

    return NextResponse.json({
      success: true,
      results,
      summary: {
        projectId,
        environmentId,
        serviceId,
        deploymentId,
        token: token?.substring(0, 20) + '...',
        nextSteps: [
          'Monitor deployment status using the deployment ID',
          'Service will be available at the provided URL when healthy',
          'Check logs if deployment fails'
        ]
      }
    });

  } catch (error) {
    console.error('Deploy workflow error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
