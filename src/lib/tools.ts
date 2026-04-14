export interface Tool {
  name: string;
  cost: number;
  locus_supported: boolean;
  task_types: string[];
  description: string;
  provider?: string;
}

export const TOOLS: Tool[] = [
  {
    name: "Anthropic Claude",
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
    description: "Real-time web search API"
  },
  {
    name: 'Tavily',
    cost: 0.005,
    locus_supported: true,
    task_types: ['search'],
    description: 'Real-time search API for AI agents',
    provider: 'Tavily'
  },
  {
    name: 'Exa',
    cost: 0.01,
    locus_supported: true,
    task_types: ['search'],
    description: 'Neural search for web content',
    provider: 'Exa'
  },
  {
    name: 'Firecrawl',
    cost: 0.001,
    locus_supported: true,
    task_types: ['web-scraping'],
    description: 'Turn websites into LLM-ready data',
    provider: 'Firecrawl'
  },
  {
    name: 'Browser Use',
    cost: 0.015,
    locus_supported: true,
    task_types: ['web-scraping'],
    description: 'Automated browser interactions',
    provider: 'Browser Use'
  },
  {
    name: 'CoinGecko',
    cost: 0.001,
    locus_supported: true,
    task_types: ['data-retrieval'],
    description: 'Cryptocurrency market data',
    provider: 'CoinGecko'
  },
  {
    name: 'Wolfram|Alpha',
    cost: 0.02,
    locus_supported: true,
    task_types: ['analysis'],
    description: 'Computational intelligence engine',
    provider: 'Wolfram'
  },
  {
    name: 'DeepL',
    cost: 0.01,
    locus_supported: true,
    task_types: ['content-generation'],
    description: 'Advanced language translation',
    provider: 'DeepL'
  },
  {
    name: 'Deepgram',
    cost: 0.01,
    locus_supported: true,
    task_types: ['content-generation'],
    description: 'Speech-to-text API',
    provider: 'Deepgram'
  },
  {
    name: 'Stability AI',
    cost: 0.02,
    locus_supported: true,
    task_types: ['content-generation'],
    description: 'Text-to-image generation',
    provider: 'Stability AI'
  },
  {
    name: 'Suno',
    cost: 0.03,
    locus_supported: true,
    task_types: ['content-generation'],
    description: 'AI music generation',
    provider: 'Suno'
  },
  {
    name: 'VirusTotal',
    cost: 0.01,
    locus_supported: true,
    task_types: ['analysis'],
    description: 'URL and file security analysis',
    provider: 'VirusTotal'
  },
  {
    name: 'ScreenshotOne',
    cost: 0.005,
    locus_supported: true,
    task_types: ['web-scraping'],
    description: 'Website screenshot API',
    provider: 'ScreenshotOne'
  },
  {
    name: 'Replicate',
    cost: 0.025,
    locus_supported: true,
    task_types: ['content-generation'],
    description: 'Platform for AI models',
    provider: 'Replicate'
  },
  {
    name: 'AgentMail',
    cost: 0.005,
    locus_supported: true,
    task_types: ['content-generation'],
    description: 'Email sending API',
    provider: 'AgentMail'
  },
  {
    name: 'Billboard',
    cost: 0.01,
    locus_supported: true,
    task_types: ['content-generation'],
    description: 'Digital advertising API',
    provider: 'Billboard'
  }
];

export const TASK_TYPE_KEYWORDS: Record<string, string[]> = {
  'content-generation': [
    'write', 'generate', 'create', 'content', 'text', 'article', 'story', 'email',
    'translate', 'summarize', 'music', 'image', 'speech', 'advertise', 'mail'
  ],
  'search': [
    'search', 'find', 'get', 'fetch', 'data', 'information', 'lookup', 'research',
    'query', 'explore', 'discover'
  ],
  'web-scraping': [
    'scrape', 'extract', 'crawl', 'collect', 'harvest', 'leads', 'contact',
    'screenshot', 'browser', 'website'
  ],
  'data-retrieval': [
    'data', 'market', 'price', 'crypto', 'currency', 'rates', 'statistics',
    'information', 'details', 'specs'
  ],
  'analysis': [
    'analyze', 'process', 'review', 'evaluate', 'assess', 'check', 'security',
    'virus', 'malware', 'safety', 'risk', 'compute', 'calculate'
  ],
  'data_extraction': ["extract", "data", "collect", "gather"],
  'monitoring': ["monitor", "track", "watch", "observe"],
  'weather': ["weather", "forecast", "temperature", "climate"],
  'data_lookup': ["lookup", "data", "information", "details"]
};
