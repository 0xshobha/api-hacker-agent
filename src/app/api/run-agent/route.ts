import { NextRequest, NextResponse } from 'next/server';
import { AgentLogic } from '@/lib/agent';
import { PaymentEngine } from '@/lib/payment';
import { ProviderDetector } from '@/lib/provider-detection';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { task, budget } = body;

    if (!task || !budget) {
      return NextResponse.json(
        { error: 'Task and budget are required' },
        { status: 400 }
      );
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
      return NextResponse.json({
        success: false,
        message: 'Payment failed',
        data: {
          task,
          budget,
          status: 'payment_failed',
          executionTime: '0.5s',
          totalCost: 0,
          apisUsed: [],
          results: null,
          logs,
          providerInfo: null
        }
      });
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

    const response = {
      success: true,
      message: 'Agent execution completed',
      data: {
        task,
        budget,
        status: 'completed',
        executionTime: '2.3s',
        totalCost: paymentResult.cost,
        remainingBudget: paymentResult.remainingBudget,
        apisUsed: [agentResult.selectedTool],
        results: {
          summary: `Successfully processed task: ${task}`,
          details: `Used ${agentResult.selectedTool.name} via ${paymentResult.paymentMethod}`,
          confidence: 0.92
        },
        logs,
        providerInfo,
        paymentMethod: paymentResult.paymentMethod
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
