import { Tool } from './tools';

export interface PaymentResult {
  success: boolean;
  paymentMethod: 'locus' | 'fallback';
  cost: number;
  remainingBudget: number;
  logs: string[];
  error?: string;
}

export class PaymentEngine {
  // Check if selected tool cost is within budget
  static checkBudget(tool: Tool, budget: number): {
    canAfford: boolean;
    remainingBudget: number;
  } {
    const canAfford = tool.cost <= budget;
    const remainingBudget = canAfford ? budget - tool.cost : budget;

    return { canAfford, remainingBudget };
  }

  // Simulate Locus payment flow
  static async processLocusPayment(tool: Tool, budget: number): Promise<PaymentResult> {
    const logs: string[] = [];
    const budgetCheck = this.checkBudget(tool, budget);

    logs.push(`Checking budget for ${tool.name}: $${tool.cost}`);
    logs.push(`Available budget: $${budget}`);

    if (!budgetCheck.canAfford) {
      logs.push(`Insufficient funds: need $${tool.cost}, have $${budget}`);
      return {
        success: false,
        paymentMethod: 'locus',
        cost: tool.cost,
        remainingBudget: budget,
        logs,
        error: 'Insufficient budget'
      };
    }

    // Simulate Locus payment flow
    logs.push(`Initiating Locus payment for ${tool.name}...`);

    try {
      // Step 1: Check wallet balance
      logs.push('Checking Locus wallet balance...');
      await this.simulateDelay(100);
      logs.push('Wallet balance sufficient');

      // Step 2: Attempt payment
      logs.push('Processing payment via Locus...');
      await this.simulateDelay(200);

      // Deterministic payment flow - no random failures
      logs.push('Payment successful');

      // Step 3: Confirm API access
      logs.push(`Gained access to ${tool.name} via Locus`);
      logs.push(`Payment processed: $${tool.cost}`);

      return {
        success: true,
        paymentMethod: 'locus',
        cost: tool.cost,
        remainingBudget: budgetCheck.remainingBudget,
        logs
      };

    } catch (error) {
      logs.push('Locus payment failed unexpectedly');
      return {
        success: false,
        paymentMethod: 'locus',
        cost: tool.cost,
        remainingBudget: budget,
        logs,
        error: 'Locus payment error'
      };
    }
  }

  // Fallback API for non-Locus supported tools
  static async processFallbackPayment(tool: Tool, budget: number): Promise<PaymentResult> {
    const logs: string[] = [];
    const budgetCheck = this.checkBudget(tool, budget);

    logs.push(`${tool.name} is not Locus-supported`);
    logs.push('Initiating fallback API payment...');
    logs.push(`Checking budget for ${tool.name}: $${tool.cost}`);

    if (!budgetCheck.canAfford) {
      logs.push(`Insufficient funds: need $${tool.cost}, have $${budget}`);
      return {
        success: false,
        paymentMethod: 'fallback',
        cost: tool.cost,
        remainingBudget: budget,
        logs,
        error: 'Insufficient budget'
      };
    }

    try {
      // Simulate API key retrieval
      logs.push('Retrieving API key from secure storage...');
      await this.simulateDelay(150);
      logs.push('API key retrieved successfully');

      // Simulate direct API payment
      logs.push(`Processing direct payment to ${tool.name}...`);
      await this.simulateDelay(200);
      logs.push('Direct payment successful');

      logs.push(`Using API key for ${tool.name}`);
      logs.push(`Payment processed: $${tool.cost}`);

      return {
        success: true,
        paymentMethod: 'fallback',
        cost: tool.cost,
        remainingBudget: budgetCheck.remainingBudget,
        logs
      };

    } catch (error) {
      logs.push('Fallback API payment failed');
      return {
        success: false,
        paymentMethod: 'fallback',
        cost: tool.cost,
        remainingBudget: budget,
        logs,
        error: 'Fallback API error'
      };
    }
  }

  // Main payment processing logic
  static async processPayment(tool: Tool, budget: number): Promise<PaymentResult> {
    if (tool.locus_supported) {
      return await this.processLocusPayment(tool, budget);
    } else {
      return await this.processFallbackPayment(tool, budget);
    }
  }

  // Helper function to simulate delays
  private static simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
