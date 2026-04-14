import { Tool, TOOLS as toolRegistry, TASK_TYPE_KEYWORDS as taskTypeKeywords } from './tools';

export class AgentLogic {
  // Filter tools based on task type using keyword matching
  static filterToolsByTask(task: string): Tool[] {
    const taskLower = task.toLowerCase();
    const matchedTaskTypes: string[] = [];

    // Find matching task types based on keywords
    Object.entries(taskTypeKeywords).forEach(([taskType, keywords]) => {
      if (keywords.some(keyword => taskLower.includes(keyword))) {
        matchedTaskTypes.push(taskType);
      }
    });

    // If no specific task type matches, return all tools (not just locus-supported)
    if (matchedTaskTypes.length === 0) {
      return toolRegistry;
    }

    // Filter tools that support any of the matched task types
    const filteredTools = toolRegistry.filter(tool =>
      tool.task_types.some(taskType => matchedTaskTypes.includes(taskType))
    );

    return filteredTools;
  }

  // Select cheapest tool from filtered list (prioritizing Locus-supported tools)
  static selectCheapestTool(tools: Tool[], budget: number): Tool | null {
    if (tools.length === 0) return null;

    // First try to find tools within budget that are Locus supported
    const affordableLocusTools = tools.filter(tool =>
      tool.cost <= budget && tool.locus_supported
    );

    if (affordableLocusTools.length > 0) {
      return affordableLocusTools.reduce((cheapest, current) =>
        current.cost < cheapest.cost ? current : cheapest
      );
    }

    // If no Locus tools within budget, try any tool within budget
    const affordableTools = tools.filter(tool => tool.cost <= budget);

    if (affordableTools.length > 0) {
      return affordableTools.reduce((cheapest, current) =>
        current.cost < cheapest.cost ? current : cheapest
      );
    }

    // If nothing within budget, return the cheapest Locus-supported tool
    const locusTools = tools.filter(tool => tool.locus_supported);
    if (locusTools.length > 0) {
      return locusTools.reduce((cheapest, current) =>
        current.cost < cheapest.cost ? current : cheapest
      );
    }

    // Last resort: return the absolute cheapest tool
    return tools.reduce((cheapest, current) =>
      current.cost < cheapest.cost ? current : cheapest
    );
  }

  // Complete agent execution logic
  static executeTask(task: string, budget: number): {
    selectedTool: Tool | null;
    filteredTools: Tool[];
    canExecute: boolean;
    reasoning: string[];
  } {
    const reasoning: string[] = [];

    reasoning.push(`Analyzing task: "${task}"`);
    reasoning.push(`Available budget: $${budget}`);

    // Step 1: Filter tools by task type
    const filteredTools = this.filterToolsByTask(task);
    reasoning.push(`Found ${filteredTools.length} tools matching task requirements`);

    if (filteredTools.length === 0) {
      reasoning.push('No tools found for this task type');
      return {
        selectedTool: null,
        filteredTools: [],
        canExecute: false,
        reasoning
      };
    }

    // Step 2: Select cheapest tool
    const selectedTool = this.selectCheapestTool(filteredTools, budget);

    if (!selectedTool) {
      reasoning.push('No suitable tool found');
      return {
        selectedTool: null,
        filteredTools,
        canExecute: false,
        reasoning
      };
    }

    reasoning.push(`Selected tool: ${selectedTool.name} ($${selectedTool.cost})`);

    const canExecute = selectedTool.cost <= budget;
    reasoning.push(`Execution ${canExecute ? 'possible' : 'exceeds budget'}`);

    return {
      selectedTool,
      filteredTools,
      canExecute,
      reasoning
    };
  }
}
