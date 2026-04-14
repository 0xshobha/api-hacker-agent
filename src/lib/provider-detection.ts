import { Tool } from './tools';

export interface ProviderMessage {
  subject: string;
  body: string;
  contactEmail?: string;
}

export class ProviderDetector {
  // Detect if selected tool is not Locus-supported
  static isNonLocusTool(tool: Tool): boolean {
    return !tool.locus_supported;
  }

  // Generate message suggesting provider to integrate PayWithLocus
  static generatePayWithLocusMessage(tool: Tool): ProviderMessage {
    const subject = `Integrate PayWithLocus for ${tool.name} - Increase Your User Base`;
    
    const body = `Dear ${tool.name} Team,

I'm writing as a potential user who would love to use your services through PayWithLocus, the payment infrastructure for AI agents.

**Why This Matters**
You are losing users by not supporting Locus payments. PayWithLocus enables AI agents to autonomously pay for APIs, and your absence from their ecosystem means you're missing out on:

- Growing AI agent market
- Developers building autonomous systems
- Automated API consumption at scale
- Revenue from agent-driven usage

**The Opportunity**
PayWithLocus provides:
- Single USDC wallet for all API payments
- Built-in spending controls and policies
- Automatic audit trails
- Access to 44+ APIs through one interface
- No subscription model - pay-per-use

**Integration Benefits**
- Access to new user segment (AI agent developers)
- Increased API usage through automated systems
- Simplified payment processing
- Competitive advantage over providers who haven't integrated

**Next Steps**
Integrating with PayWithLocus is straightforward:
1. Contact the PayWithLocus team at https://paywithlocus.com
2. Set up pricing for your API
3. Get listed in their catalog
4. Start serving AI agent customers

The AI agent market is growing rapidly. Don't miss this opportunity to be at the forefront of autonomous API consumption.

I look forward to using ${tool.name} through PayWithLocus soon!

Best regards,
A potential AI agent developer

---
Learn more about PayWithLocus: https://paywithlocus.com
See current API catalog: https://paywithlocus.com/endpoints`;

    // Common contact emails for major providers
    const contactEmails: Record<string, string> = {
      'Anthropic Claude': 'support@anthropic.com',
      'RapidAPI Weather': 'support@rapidapi.com'
    };

    return {
      subject,
      body,
      contactEmail: contactEmails[tool.name]
    };
  }

  // Create mailto link with message
  static createMailtoLink(tool: Tool): string {
    const message = this.generatePayWithLocusMessage(tool);
    const email = message.contactEmail || 'support@' + tool.name.toLowerCase().replace(/\s+/g, '') + '.com';
    
    const subject = encodeURIComponent(message.subject);
    const body = encodeURIComponent(message.body);
    
    return `mailto:${email}?subject=${subject}&body=${body}`;
  }

  // Get provider integration status
  static getProviderStatus(tool: Tool): {
    isSupported: boolean;
    message: string;
    actionText: string;
    severity: 'info' | 'warning' | 'error';
  } {
    if (tool.locus_supported) {
      return {
        isSupported: true,
        message: `${tool.name} is integrated with PayWithLocus - optimal for AI agents!`,
        actionText: 'Pay with Locus',
        severity: 'info'
      };
    } else {
      return {
        isSupported: false,
        message: `${tool.name} doesn't support PayWithLocus - you're missing out on AI agent revenue!`,
        actionText: 'Notify Provider',
        severity: 'warning'
      };
    }
  }

  // Get all non-Locus tools from registry
  static getNonLocusTools(tools: Tool[]): Tool[] {
    return tools.filter(tool => !tool.locus_supported);
  }

  // Calculate potential revenue loss
  static calculateRevenueLoss(tool: Tool, estimatedAgentUsers: number = 1000): {
    dailyLoss: number;
    monthlyLoss: number;
    yearlyLoss: number;
  } {
    const avgCallsPerAgentPerDay = 10;
    const dailyCalls = estimatedAgentUsers * avgCallsPerAgentPerDay;
    const dailyLoss = dailyCalls * tool.cost;
    
    return {
      dailyLoss,
      monthlyLoss: dailyLoss * 30,
      yearlyLoss: dailyLoss * 365
    };
  }
}
