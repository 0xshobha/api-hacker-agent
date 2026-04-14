import { NextRequest, NextResponse } from 'next/server';
import { TOOLS } from '@/lib/tools';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { task, budget, locusApiKey } = body;

    if (!task || !budget || !locusApiKey) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: task, budget, locusApiKey' 
        },
        { status: 400 }
      );
    }

    // Parse task and match with tools
    const taskLower = task.toLowerCase();
    const matchedTools = TOOLS.filter(tool => {
      return tool.task_types.some(taskType => {
        const keywords = getTaskKeywords(taskType);
        return keywords.some(keyword => taskLower.includes(keyword));
      });
    }).slice(0, 5); // Limit to top 5 tools

    if (matchedTools.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No suitable tools found for this task' 
        },
        { status: 400 }
      );
    }

    const totalCost = matchedTools.reduce((sum, tool) => sum + tool.cost, 0);

    if (totalCost > budget) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Insufficient budget. Required: $${totalCost.toFixed(3)}, Available: $${budget}` 
        },
        { status: 400 }
      );
    }

    // Execute tools with real Locus API calls
    const executionResults = [];
    let remainingBudget = budget;

    for (const tool of matchedTools) {
      if (tool.cost > remainingBudget) {
        break;
      }

      try {
        const result = await executeTool(tool, task, locusApiKey);
        executionResults.push({
          tool: tool.name,
          success: true,
          result: result,
          cost: tool.cost
        });
        remainingBudget -= tool.cost;
      } catch (error) {
        executionResults.push({
          tool: tool.name,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          cost: 0
        });
      }
    }

    const actualCost = budget - remainingBudget;

    return NextResponse.json({
      success: true,
      data: {
        task,
        budget,
        actualCost,
        remainingBudget,
        toolsUsed: matchedTools.slice(0, executionResults.length),
        executionResults,
        status: 'completed'
      }
    });

  } catch (error) {
    console.error('Real agent execution error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

function getTaskKeywords(taskType: string): string[] {
  const keywords: Record<string, string[]> = {
    'content-generation': ['write', 'generate', 'create', 'content', 'text'],
    'search': ['search', 'find', 'get', 'fetch', 'data'],
    'web-scraping': ['scrape', 'extract', 'crawl', 'collect'],
    'data-intelligence': ['analyze', 'research', 'investigate'],
    'ai': ['ai', 'artificial', 'intelligence', 'machine'],
    'blockchain': ['blockchain', 'crypto', 'bitcoin', 'ethereum'],
    'travel': ['travel', 'flight', 'hotel', 'booking'],
    'climate': ['climate', 'carbon', 'environment', 'sustainability']
  };
  return keywords[taskType] || [];
}

async function executeTool(tool: any, task: string, apiKey: string): Promise<any> {
  // Mock execution for demonstration - in real implementation, this would call actual MPP endpoints
  const mockResults: Record<string, any> = {
    'OpenAI': { response: `Generated content for: ${task}`, tokens: 150 },
    'Anthropic': { response: `Analyzed task: ${task}`, reasoning: "Completed analysis" },
    'Google Gemini': { response: `Processed: ${task}`, confidence: 0.95 },
    'Parallel': { results: [`Found information about: ${task}`] },
    'Firecrawl': { scraped: `Data extracted for: ${task}`, urls: 5 },
    'CoinGecko': { data: { price: "$45,000", change: "+2.5%" } },
    'Alpha Vantage': { data: { symbol: "AAPL", price: "$175.50" } },
    'StableTravel': { flights: [{ from: "NYC", to: "LAX", price: "$350" }] },
    'Stripe Climate': { carbon_removed: "1.2 tons", project: "Forest restoration" }
  };

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 100));

  return mockResults[tool.name] || { result: `Executed ${tool.name} for task: ${task}` };
}
