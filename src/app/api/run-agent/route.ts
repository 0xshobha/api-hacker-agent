import { NextRequest, NextResponse } from 'next/server';
import { AgentLogic } from '@/lib/agent';
import { PaymentEngine } from '@/lib/payment';
import { ProviderDetector } from '@/lib/provider-detection';
import { RealAPI } from '@/lib/real-api';
import { ValidationError, PaymentError, formatErrorResponse } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const startTime = Date.now();
    const body = await request.json();
    const { task, budget } = body;

    if (!task || typeof budget !== 'number' || budget <= 0) {
      throw new ValidationError('Task and positive budget are required');
    }

    // Execute agent logic
    const agentResult = AgentLogic.executeTask(task, budget);
    const logs = [...agentResult.reasoning];

    if (!agentResult.selectedTool || !agentResult.canExecute) {
      return NextResponse.json({
        success: false,
        message: 'No suitable tool found',
        data: {
          task,
          budget,
          status: 'failed',
          executionTime: '0.1s',
          totalCost: 0,
          apisUsed: [],
          results: null,
          logs,
          providerInfo: null
        }
      });
    }

    // Process payment
    const paymentResult = await PaymentEngine.processPayment(agentResult.selectedTool, budget);
    logs.push(...paymentResult.logs);

    if (!paymentResult.success) {
      throw new PaymentError('Payment processing failed');
    }

    // Check provider status and generate provider info
    const providerStatus = ProviderDetector.getProviderStatus(agentResult.selectedTool);
    logs.push(`Provider status: ${providerStatus.message}`);

    let providerInfo = null;
    if (!agentResult.selectedTool.locus_supported) {
      const message = ProviderDetector.generatePayWithLocusMessage(agentResult.selectedTool);
      const mailtoLink = ProviderDetector.createMailtoLink(agentResult.selectedTool);
      const revenueLoss = ProviderDetector.calculateRevenueLoss(agentResult.selectedTool);

      providerInfo = {
        isSupported: false,
        toolName: agentResult.selectedTool.name,
        message: providerStatus.message,
        actionText: providerStatus.actionText,
        mailtoLink,
        revenueLoss,
        suggestedMessage: message
      };

      logs.push(`Revenue opportunity: $${revenueLoss.monthlyLoss.toFixed(2)}/month lost`);
    } else {
      providerInfo = {
        isSupported: true,
        toolName: agentResult.selectedTool.name,
        message: providerStatus.message,
        actionText: providerStatus.actionText
      };
    }

    // Execute real API call
    const apiKey = process.env.SERP_API_KEY || process.env.OPENAI_API_KEY;
    const apiExecution = await RealAPI.executeRealAPI(
      task,
      agentResult.selectedTool.name,
      apiKey
    );

    logs.push(...apiExecution.logs);

    if (!apiExecution.success) {
      return NextResponse.json({
        success: false,
        message: 'API execution failed',
        data: {
          task,
          budget,
          status: 'api_failed',
          executionTime: `${((Date.now() - startTime) / 1000).toFixed(1)}s`,
          totalCost: paymentResult.cost,
          apisUsed: [agentResult.selectedTool],
          results: null,
          logs,
          providerInfo
        }
      });
    }

    const response = {
      success: true,
      message: 'Agent execution completed',
      data: {
        task,
        budget,
        status: 'completed',
        executionTime: `${((Date.now() - startTime) / 1000).toFixed(1)}s`,
        totalCost: paymentResult.cost,
        remainingBudget: paymentResult.remainingBudget,
        apisUsed: [agentResult.selectedTool],
        results: apiExecution.results,
        logs,
        providerInfo,
        paymentMethod: paymentResult.paymentMethod
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(formatErrorResponse(error), { status: 500 });
  }
}
