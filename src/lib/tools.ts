export interface Tool {
  name: string;
  cost: number; // cost per call in USD
  locus_supported: boolean;
  task_types: string[];
  description: string;
}

export const toolRegistry: Tool[] = [
  {
    name: "OpenAI GPT-4",
    cost: 0.03,
    locus_supported: true,
    task_types: ["text_generation", "analysis", "summarization", "coding"],
    description: "Advanced language model for text processing and analysis"
  },
  {
    name: "Serper Search",
    cost: 0.002,
    locus_supported: true,
    task_types: ["search", "research", "fact_checking"],
    description: "Real-time web search and information retrieval"
  },
  {
    name: "ScrapeOps",
    cost: 0.001,
    locus_supported: true,
    task_types: ["scraping", "data_extraction", "monitoring"],
    description: "Web scraping and data extraction service"
  },
  {
    name: "Anthropic Claude",
    cost: 0.025,
    locus_supported: false,
    task_types: ["text_generation", "analysis", "summarization"],
    description: "Alternative language model (not Locus supported)"
  },
  {
    name: "RapidAPI Weather",
    cost: 0.005,
    locus_supported: false,
    task_types: ["weather", "data_lookup"],
    description: "Weather data and forecasts"
  }
];

// Task type to keyword mapping for filtering
export const taskTypeKeywords: Record<string, string[]> = {
  text_generation: ["write", "generate", "create", "compose", "draft"],
  analysis: ["analyze", "examine", "review", "assess", "evaluate"],
  search: ["search", "find", "lookup", "research", "information"],
  scraping: ["scrape", "extract", "collect", "monitor", "track"],
  summarization: ["summarize", "summary", "condense", "brief"],
  coding: ["code", "program", "develop", "implement", "script"],
  research: ["research", "study", "investigate", "explore"],
  fact_checking: ["verify", "fact", "check", "validate", "confirm"],
  data_extraction: ["extract", "data", "collect", "gather"],
  monitoring: ["monitor", "track", "watch", "observe"],
  weather: ["weather", "forecast", "temperature", "climate"],
  data_lookup: ["lookup", "data", "information", "details"]
};
