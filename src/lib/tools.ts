export interface Tool {
  name: string;
  cost: number;
  locus_supported: boolean;
  task_types: string[];
  description: string;
  provider?: string;
}

export const TOOLS: Tool[] = [
  // AI / LLM Models
  {
    name: "OpenAI",
    cost: 0.0001,
    locus_supported: true,
    task_types: ["content-generation", "analysis", "coding", "image-generation"],
    description: "AI models - chat completions, embeddings, image generation/editing, text-to-speech, and content moderation",
    provider: "OpenAI"
  },
  {
    name: "Anthropic",
    cost: 0.001,
    locus_supported: true,
    task_types: ["content-generation", "analysis", "coding", "vision"],
    description: "Claude AI models - chat completions, vision, document processing, extended thinking, and tool use",
    provider: "Anthropic"
  },
  {
    name: "Google Gemini",
    cost: 0.0002,
    locus_supported: true,
    task_types: ["content-generation", "vision", "analysis"],
    description: "Multimodal AI - chat, vision, PDF/document processing, thinking/reasoning, and embeddings",
    provider: "Google"
  },
  {
    name: "DeepSeek",
    cost: 0.003,
    locus_supported: true,
    task_types: ["content-generation", "coding", "reasoning"],
    description: "Frontier AI models - DeepSeek-V3 for fast chat and code, DeepSeek-R1 for deep chain-of-thought reasoning",
    provider: "DeepSeek"
  },
  {
    name: "Mistral AI",
    cost: 0.005,
    locus_supported: true,
    task_types: ["content-generation", "coding", "vision"],
    description: "Premier and open-source LLMs - Mistral Large, Medium, Small, Codestral, Magistral reasoning, Pixtral vision",
    provider: "Mistral AI"
  },
  {
    name: "Groq",
    cost: 0.005,
    locus_supported: true,
    task_types: ["content-generation", "speech", "coding"],
    description: "Ultra-fast LLM inference - Llama 3.3, DeepSeek R1, Gemma 2, GPT-OSS, Qwen, Whisper, and PlayAI TTS",
    provider: "Groq"
  },
  {
    name: "Grok",
    cost: 0.001,
    locus_supported: true,
    task_types: ["content-generation", "search", "image-generation"],
    description: "xAI models - chat, web/X search, code execution, image generation/editing, and text-to-speech",
    provider: "xAI"
  },

  // AI Search & Research
  {
    name: "Perplexity",
    cost: 0.001,
    locus_supported: true,
    task_types: ["search", "research"],
    description: "AI-powered search - Sonar chat with real-time web grounding, web search, and embeddings",
    provider: "Perplexity"
  },
  {
    name: "Exa",
    cost: 0.004,
    locus_supported: true,
    task_types: ["search", "research"],
    description: "AI-native search engine - semantic search, content retrieval, and research",
    provider: "Exa"
  },
  {
    name: "Brave Search",
    cost: 0.035,
    locus_supported: true,
    task_types: ["search", "research"],
    description: "Independent web search - web, news, images, videos, AI answers, and LLM context",
    provider: "Brave"
  },
  {
    name: "Tavily",
    cost: 0.09,
    locus_supported: true,
    task_types: ["search", "web-scraping"],
    description: "AI-optimized web search, content extraction, site mapping, and crawling API",
    provider: "Tavily"
  },

  // Web Scraping & Browser Automation
  {
    name: "Firecrawl",
    cost: 0.003,
    locus_supported: true,
    task_types: ["web-scraping", "data-extraction"],
    description: "Web scraping, crawling, and structured data extraction API",
    provider: "Firecrawl"
  },
  {
    name: "Browser Use",
    cost: 0.01,
    locus_supported: true,
    task_types: ["web-scraping", "automation"],
    description: "AI-powered browser automation - run tasks in a cloud browser with LLM agents",
    provider: "Browser Use"
  },
  {
    name: "Diffbot",
    cost: 0.004,
    locus_supported: true,
    task_types: ["web-scraping", "data-extraction"],
    description: "Web data extraction - articles, products, discussions, images, videos, and auto-detect",
    provider: "Diffbot"
  },
  {
    name: "ScreenshotOne",
    cost: 0.055,
    locus_supported: true,
    task_types: ["web-scraping", "developer-tools"],
    description: "Website screenshot API - capture any URL, HTML, or markdown as PNG, JPEG, WebP, or PDF",
    provider: "ScreenshotOne"
  },

  // AI Generative (Image, Audio, Video)
  {
    name: "Stability AI",
    cost: 0.023,
    locus_supported: true,
    task_types: ["content-generation", "image-generation"],
    description: "Generative AI platform for images, 3D models, and audio - text-to-image, editing, upscaling",
    provider: "Stability AI"
  },
  {
    name: "Replicate",
    cost: 0.001,
    locus_supported: true,
    task_types: ["content-generation", "image-generation", "audio"],
    description: "Run thousands of open-source AI models via API - image generation, language models, speech recognition",
    provider: "Replicate"
  },
  {
    name: "fal.ai",
    cost: 0.001,
    locus_supported: true,
    task_types: ["content-generation", "image-generation", "video"],
    description: "Generative AI platform - 600+ models for image, video, audio generation and more",
    provider: "fal.ai"
  },
  {
    name: "Suno",
    cost: 0.005,
    locus_supported: true,
    task_types: ["content-generation", "audio"],
    description: "AI music generation - create full songs, generate lyrics, and build custom music tracks",
    provider: "Suno"
  },

  // AI Speech & Translation
  {
    name: "Deepgram",
    cost: 0.001,
    locus_supported: true,
    task_types: ["content-generation", "speech", "analysis"],
    description: "Industry-leading speech AI - transcribe audio from URLs with Nova-3, generate natural speech with Aura-2 TTS",
    provider: "Deepgram"
  },
  {
    name: "DeepL",
    cost: 0.005,
    locus_supported: true,
    task_types: ["content-generation", "translation"],
    description: "Professional translation and text improvement - translate text between 30+ languages with industry-leading quality",
    provider: "DeepL"
  },

  // AI OCR & Math
  {
    name: "Mathpix",
    cost: 0.005,
    locus_supported: true,
    task_types: ["content-generation", "ocr", "analysis"],
    description: "OCR for math, science, and documents - extract LaTeX, MathML, and Mathpix Markdown from images and handwriting",
    provider: "Mathpix"
  },

  // Data Intelligence & Enrichment
  {
    name: "Apollo",
    cost: 0.005,
    locus_supported: true,
    task_types: ["data-enrichment", "lead-generation"],
    description: "People and company enrichment, lead search, and sales intelligence with 275M+ contacts",
    provider: "Apollo"
  },
  {
    name: "Hunter",
    cost: 0.003,
    locus_supported: true,
    task_types: ["data-enrichment", "lead-generation"],
    description: "Email finding, verification, and company enrichment for outreach and lead generation",
    provider: "Hunter"
  },
  {
    name: "Clado",
    cost: 0.01,
    locus_supported: true,
    task_types: ["data-enrichment", "lead-generation"],
    description: "People search, LinkedIn enrichment, and deep research for lead generation",
    provider: "Clado"
  },
  {
    name: "BuiltWith",
    cost: 0.015,
    locus_supported: true,
    task_types: ["data-intelligence", "analysis"],
    description: "Technology profiling for websites - detect tech stacks, find sites using specific technologies",
    provider: "BuiltWith"
  },
  {
    name: "Whitepages Pro",
    cost: 0.005,
    locus_supported: true,
    task_types: ["data-intelligence", "search"],
    description: "People search, reverse phone lookup, property ownership, and deed events powered by 4B+ data linkages",
    provider: "Whitepages Pro"
  },

  // Data Finance & Crypto
  {
    name: "Alpha Vantage",
    cost: 0.008,
    locus_supported: true,
    task_types: ["data-finance", "data-intelligence"],
    description: "Financial market data - stock prices, forex, crypto, commodities, economic indicators, technical analysis",
    provider: "Alpha Vantage"
  },
  {
    name: "CoinGecko",
    cost: 0.06,
    locus_supported: true,
    task_types: ["data-crypto", "data-intelligence"],
    description: "Cryptocurrency market data - prices, charts, market cap, exchanges, trending coins, global stats, NFTs",
    provider: "CoinGecko"
  },
  {
    name: "EDGAR (SEC)",
    cost: 0.003,
    locus_supported: true,
    task_types: ["data-finance", "search"],
    description: "SEC EDGAR public financial data - company filing history, XBRL financial facts and full-text search",
    provider: "SEC"
  },
  {
    name: "EDGAR Full-Text Search",
    cost: 0.003,
    locus_supported: true,
    task_types: ["data-finance", "search"],
    description: "Full-text search across all SEC filings - 10-Ks, 10-Qs, 8-Ks, proxy statements, and more",
    provider: "SEC"
  },
  {
    name: "RentCast",
    cost: 0.033,
    locus_supported: true,
    task_types: ["data-intelligence", "real-estate"],
    description: "US real estate intelligence - property records, AVM valuations, rent estimates, sale/rental listings",
    provider: "RentCast"
  },

  // Data Knowledge & Utilities
  {
    name: "Wolfram|Alpha",
    cost: 0.055,
    locus_supported: true,
    task_types: ["data-knowledge", "analysis", "computation"],
    description: "Computational knowledge engine - math, science, geography, history, nutrition, finance, and more",
    provider: "Wolfram"
  },
  {
    name: "Abstract API",
    cost: 0.006,
    locus_supported: true,
    task_types: ["data-utilities", "validation"],
    description: "Suite of utility APIs - email validation, IP intelligence, phone lookup, company enrichment",
    provider: "Abstract API"
  },
  {
    name: "IPinfo",
    cost: 0.001,
    locus_supported: true,
    task_types: ["data-intelligence", "geolocation"],
    description: "IP intelligence - geolocation, ASN, privacy detection, carrier data, and hosting identification",
    provider: "IPinfo"
  },
  {
    name: "OpenWeather",
    cost: 0.002,
    locus_supported: true,
    task_types: ["data-weather", "forecast"],
    description: "Global weather data - current conditions, 5-day forecasts, hourly forecasts, air quality index",
    provider: "OpenWeather"
  },

  // Developer Tools
  {
    name: "Judge0",
    cost: 0.005,
    locus_supported: true,
    task_types: ["developer-tools", "coding"],
    description: "Online code execution - run source code in 60+ programming languages with sandboxed isolation",
    provider: "Judge0"
  },

  // Geospatial
  {
    name: "Mapbox",
    cost: 0.002,
    locus_supported: true,
    task_types: ["geospatial", "mapping"],
    description: "Location and mapping APIs - geocoding, directions, isochrones, matrix routing, map matching",
    provider: "Mapbox"
  },

  // Payments
  {
    name: "Laso Finance",
    cost: 0.001,
    locus_supported: true,
    task_types: ["payments", "finance"],
    description: "Virtual card and payment APIs - provision debit cards and send payments",
    provider: "Laso Finance"
  },

  // Security & Compliance
  {
    name: "VirusTotal",
    cost: 0.055,
    locus_supported: true,
    task_types: ["security", "analysis"],
    description: "Threat intelligence platform - scan files by hash, URLs, domains, and IPs against 70+ antivirus engines",
    provider: "VirusTotal"
  },
  {
    name: "OFAC Sanctions API",
    cost: 0.012,
    locus_supported: true,
    task_types: ["compliance", "kyc"],
    description: "Screen individuals, entities, vessels, and crypto wallets against 25+ global sanctions lists",
    provider: "OFAC"
  },

  // Email
  {
    name: "AgentMail",
    cost: 0.001,
    locus_supported: true,
    task_types: ["email", "communication"],
    description: "Email for AI agents - create inboxes, send/receive messages, manage threads",
    provider: "AgentMail"
  },

  // Social Media
  {
    name: "X (Twitter)",
    cost: 0.016,
    locus_supported: true,
    task_types: ["social-media", "search"],
    description: "Read tweets, search posts, look up users, get timelines, followers, and trending topics from X/Twitter",
    provider: "X"
  },
  {
    name: "Billboard",
    cost: 0.01,
    locus_supported: true,
    task_types: ["social", "advertising"],
    description: "Post to @MPPBillboard on X. Price starts at $0.01 and doubles with every post",
    provider: "MPP"
  },

  // Additional MPP Services (45 more)
  {
    name: "Parallel",
    cost: 0.01,
    locus_supported: true,
    task_types: ["search", "research", "web-scraping"],
    description: "Web search, page extraction, and multi-hop web research",
    provider: "Parallel"
  },
  {
    name: "Alchemy",
    cost: 0.01,
    locus_supported: true,
    task_types: ["blockchain", "data-crypto"],
    description: "Blockchain data APIs including Core RPC APIs, Prices API, Portfolio API, and NFT API across 100+ chains",
    provider: "Alchemy"
  },
  {
    name: "OpenRouter",
    cost: 0.001,
    locus_supported: true,
    task_types: ["content-generation", "ai"],
    description: "Unified API for 100+ LLMs with live per-model pricing",
    provider: "OpenRouter"
  },
  {
    name: "StableTravel",
    cost: 0.01,
    locus_supported: true,
    task_types: ["data", "travel"],
    description: "Pay-per-request travel APIs - flights, hotels, activities, transfers, and real-time flight tracking",
    provider: "StableTravel"
  },
  {
    name: "Stripe Climate",
    cost: 0.01,
    locus_supported: true,
    task_types: ["payments", "climate"],
    description: "Fund permanent carbon removal projects via Stripe Climate",
    provider: "Stripe"
  },
  {
    name: "Browserbase",
    cost: 0.01,
    locus_supported: true,
    task_types: ["web-scraping", "automation"],
    description: "Headless browser sessions, web search, and page fetching for AI agents",
    provider: "Browserbase"
  },
  {
    name: "2Captcha",
    cost: 0.01,
    locus_supported: true,
    task_types: ["web", "automation"],
    description: "CAPTCHA solving API - reCAPTCHA, Turnstile, hCaptcha, image captchas, and more",
    provider: "2Captcha"
  },
  {
    name: "Allium",
    cost: 0.01,
    locus_supported: true,
    task_types: ["blockchain", "data-crypto"],
    description: "System of record for onchain finance. Real-time blockchain data: token prices, wallet balances, transactions, PnL, and SQL explorer",
    provider: "Allium"
  },
  {
    name: "Auto.exchange",
    cost: 0.01,
    locus_supported: true,
    task_types: ["ai", "marketplace"],
    description: "The agent exchange. Discover, hire, and pay agents for coding, design, writing, and more",
    provider: "Auto.exchange"
  },
  {
    name: "AviationStack",
    cost: 0.01,
    locus_supported: true,
    task_types: ["data", "travel"],
    description: "Real-time and historical flight tracking, airports, airlines, and schedules",
    provider: "AviationStack"
  },
  {
    name: "Build With Locus",
    cost: 0.01,
    locus_supported: true,
    task_types: ["compute", "deployment"],
    description: "Deploy containerized services, Postgres, Redis, and custom domains on demand - all via REST API",
    provider: "Locus"
  },
  {
    name: "Code Storage",
    cost: 0.01,
    locus_supported: true,
    task_types: ["storage", "developer-tools"],
    description: "Paid Git repository creation - create repos and get authenticated clone URLs",
    provider: "Code Storage"
  },
  {
    name: "Codex",
    cost: 0.01,
    locus_supported: true,
    task_types: ["blockchain", "data-crypto"],
    description: "Comprehensive onchain data API for tokens and prediction markets. Real-time prices, charts, trades, and wallet analytics across 80+ networks via GraphQL",
    provider: "Codex"
  },
  {
    name: "Company Enrichment",
    cost: 0.01,
    locus_supported: true,
    task_types: ["data-enrichment", "validation"],
    description: "Enrich company data from a domain name",
    provider: "Abstract API"
  },
  {
    name: "Conduit",
    cost: 0.01,
    locus_supported: true,
    task_types: ["blockchain", "compute"],
    description: "EVM JSON-RPC access to Conduit Nodes across 60+ networks including Tempo, Plume, and Polygon Katana",
    provider: "Conduit"
  },
  {
    name: "Diffbot KG",
    cost: 0.01,
    locus_supported: true,
    task_types: ["data-knowledge", "data-intelligence"],
    description: "Knowledge Graph - search 10B+ entities and enrich company/person records",
    provider: "Diffbot"
  },
  {
    name: "Diffbot NL",
    cost: 0.01,
    locus_supported: true,
    task_types: ["content-generation", "analysis"],
    description: "Natural language processing - NER, sentiment, facts, summarization",
    provider: "Diffbot"
  },
  {
    name: "Doma",
    cost: 0.01,
    locus_supported: true,
    task_types: ["web", "domains"],
    description: "Domain registration on the Doma blockchain. Instantly register .com, .xyz, .ai, .io, and .net domains",
    provider: "Doma"
  },
  {
    name: "Dune",
    cost: 0.01,
    locus_supported: true,
    task_types: ["blockchain", "data-crypto"],
    description: "Query across raw transaction data, decoded smart contract events, stablecoin flows, RWA tracking, protocol analytics, DeFi positions, NFT activity",
    provider: "Dune"
  },
  {
    name: "Email Reputation",
    cost: 0.01,
    locus_supported: true,
    task_types: ["data-utilities", "validation"],
    description: "Check the reputation and risk score of an email address",
    provider: "Abstract API"
  },
  {
    name: "Exchange Rates",
    cost: 0.01,
    locus_supported: true,
    task_types: ["data-finance", "data-utilities"],
    description: "Live, historical, and conversion exchange rates for 150+ currencies",
    provider: "Abstract API"
  },
  {
    name: "FlightAPI",
    cost: 0.01,
    locus_supported: true,
    task_types: ["data", "travel"],
    description: "Real-time flight prices, tracking, and airport schedules from 700+ airlines",
    provider: "FlightAPI"
  },
  {
    name: "GoFlightLabs",
    cost: 0.01,
    locus_supported: true,
    task_types: ["data", "travel"],
    description: "Real-time flight tracking, prices, schedules, and airline data",
    provider: "GoFlightLabs"
  },
  {
    name: "Google Maps",
    cost: 0.01,
    locus_supported: true,
    task_types: ["geospatial", "mapping", "data-utilities"],
    description: "Google Maps Platform - geocoding, directions, places, routes, tiles, weather, air quality, and more",
    provider: "Google"
  },
  {
    name: "GovLaws",
    cost: 0.01,
    locus_supported: true,
    task_types: ["data-knowledge", "legal"],
    description: "Current U.S. federal regulation lookup, semantic search, and change tracking with provenance-rich responses from official government sources",
    provider: "GovLaws"
  },
  {
    name: "Holidays",
    cost: 0.01,
    locus_supported: true,
    task_types: ["data-utilities", "validation"],
    description: "Public holiday data for 200+ countries",
    provider: "Abstract API"
  },
  {
    name: "IBAN Validation",
    cost: 0.01,
    locus_supported: true,
    task_types: ["data-utilities", "validation"],
    description: "Validate International Bank Account Numbers (IBANs)",
    provider: "Abstract API"
  },
  {
    name: "IP Intelligence",
    cost: 0.01,
    locus_supported: true,
    task_types: ["data-intelligence", "security"],
    description: "Detect VPNs, proxies, bots, and Tor nodes by IP address",
    provider: "Abstract API"
  },
  {
    name: "KicksDB",
    cost: 0.01,
    locus_supported: true,
    task_types: ["data", "market"],
    description: "Sneaker & streetwear market data - prices, sales history, and availability from StockX, GOAT, and more",
    provider: "KicksDB"
  },
  {
    name: "Modal",
    cost: 0.01,
    locus_supported: true,
    task_types: ["compute", "developer-tools"],
    description: "Serverless GPU compute for sandboxed code execution and AI/ML workloads",
    provider: "Modal"
  },
  {
    name: "Nansen",
    cost: 0.01,
    locus_supported: true,
    task_types: ["blockchain", "data-crypto"],
    description: "Blockchain analytics and smart money intelligence. Token data, wallet profiling, DEX trades, PnL, and flow analysis across multiple chains",
    provider: "Nansen"
  },
  {
    name: "Object Storage",
    cost: 0.01,
    locus_supported: true,
    task_types: ["storage", "developer-tools"],
    description: "S3/R2-compatible object storage with dynamic per-size pricing",
    provider: "Object Storage"
  }
];

export const TASK_TYPE_KEYWORDS: Record<string, string[]> = {
  'content-generation': [
    'write', 'generate', 'create', 'content', 'text', 'article', 'story', 'email',
    'translate', 'summarize', 'music', 'image', 'speech', 'advertise', 'mail',
    'chat', 'code', 'program', 'develop', 'script', 'blog', 'document', 'video',
    'audio', 'song', 'lyrics', 'poem', 'report', 'essay', 'caption', 'description'
  ],
  'search': [
    'search', 'find', 'get', 'fetch', 'data', 'information', 'lookup', 'research',
    'query', 'explore', 'discover', 'web', 'internet', 'online', 'browse', 'investigate'
  ],
  'research': [
    'research', 'study', 'investigate', 'analyze', 'examine', 'report', 'findings',
    'survey', 'analysis', 'deep-dive', 'investigation', 'background', 'due-diligence'
  ],
  'web-scraping': [
    'scrape', 'extract', 'crawl', 'collect', 'harvest', 'leads', 'contact',
    'screenshot', 'browser', 'website', 'capture', 'parse', 'html', 'css', 'dom'
  ],
  'data-extraction': [
    'extract', 'data', 'collect', 'gather', 'parse', 'structure', 'format',
    'organize', 'clean', 'process', 'transform'
  ],
  'automation': [
    'automate', 'automation', 'bot', 'robot', 'script', 'workflow', 'process',
    'task', 'routine', 'schedule', 'monitor', 'manage'
  ],
  'data-enrichment': [
    'enrich', 'enhance', 'append', 'complete', 'verify', 'validate', 'update',
    'profile', 'person', 'company', 'contact', 'lead', 'prospect', 'customer'
  ],
  'lead-generation': [
    'lead', 'prospect', 'customer', 'client', 'sales', 'marketing', 'outreach',
    'contact', 'email', 'phone', 'list', 'database', 'crm'
  ],
  'data-intelligence': [
    'intelligence', 'insights', 'analytics', 'metrics', 'statistics', 'trends',
    'patterns', 'competitive', 'market', 'industry', 'technology', 'stack'
  ],
  'data-finance': [
    'finance', 'financial', 'stock', 'market', 'trading', 'investment', 'portfolio',
    'sec', 'filing', 'report', 'earnings', 'revenue', 'profit', 'loss', 'balance'
  ],
  'data-crypto': [
    'crypto', 'cryptocurrency', 'bitcoin', 'ethereum', 'blockchain', 'token',
    'coin', 'price', 'market', 'exchange', 'trading', 'wallet', 'nft', 'defi'
  ],
  'data-knowledge': [
    'knowledge', 'facts', 'information', 'data', 'reference', 'encyclopedia',
    'wikipedia', 'math', 'science', 'history', 'geography', 'calculate', 'compute'
  ],
  'data-utilities': [
    'utility', 'tools', 'helpers', 'validate', 'verify', 'check', 'test',
    'format', 'convert', 'transform', 'clean', 'process'
  ],
  'data-weather': [
    'weather', 'forecast', 'temperature', 'climate', 'rain', 'snow', 'wind',
    'humidity', 'atmosphere', 'conditions', 'report', 'alert'
  ],
  'geospatial': [
    'map', 'location', 'geography', 'coordinates', 'gps', 'address', 'route',
    'direction', 'distance', 'area', 'region', 'place', 'spatial'
  ],
  'mapping': [
    'map', 'mapping', 'cartography', 'geocode', 'route', 'direction', 'navigation',
    'transit', 'traffic', 'journey', 'path', 'waypoint'
  ],
  'security': [
    'security', 'secure', 'protect', 'scan', 'check', 'verify', 'threat',
    'virus', 'malware', 'attack', 'breach', 'vulnerability', 'risk'
  ],
  'compliance': [
    'compliance', 'regulation', 'legal', 'kyc', 'aml', 'sanctions', 'screen',
    'verify', 'check', 'validate', 'audit', 'report', 'policy'
  ],
  'payments': [
    'payment', 'pay', 'transaction', 'money', 'transfer', 'send', 'receive',
    'card', 'debit', 'credit', 'wallet', 'bank', 'finance', 'purchase'
  ],
  'developer-tools': [
    'code', 'programming', 'develop', 'test', 'debug', 'execute', 'run',
    'compile', 'build', 'deploy', 'api', 'sdk', 'library', 'framework'
  ],
  'coding': [
    'code', 'programming', 'develop', 'write', 'script', 'function', 'method',
    'algorithm', 'logic', 'software', 'application', 'system', 'build'
  ],
  'image-generation': [
    'image', 'picture', 'photo', 'art', 'design', 'create', 'generate',
    'visual', 'graphic', 'illustration', 'draw', 'paint', 'render'
  ],
  'video': [
    'video', 'movie', 'film', 'clip', 'animation', 'motion', 'visual',
    'create', 'generate', 'produce', 'edit', 'render'
  ],
  'audio': [
    'audio', 'sound', 'music', 'voice', 'speech', 'recording', 'play',
    'transcribe', 'synthesize', 'generate', 'create', 'mix'
  ],
  'speech': [
    'speech', 'voice', 'talk', 'speak', 'dictate', 'transcribe', 'recognize',
    'synthesize', 'text-to-speech', ' tts', 'audio'
  ],
  'translation': [
    'translate', 'translation', 'language', 'convert', 'localize', 'adapt',
    'multilingual', 'global', 'international', 'i18n'
  ],
  'ocr': [
    'ocr', 'scan', 'read', 'extract', 'text', 'image', 'document', 'pdf',
    'handwriting', 'recognize', 'convert', 'parse'
  ],
  'vision': [
    'vision', 'image', 'picture', 'photo', 'visual', 'analyze', 'understand',
    'interpret', 'detect', 'recognize', 'identify'
  ],
  'reasoning': [
    'reason', 'think', 'logic', 'analyze', 'solve', 'problem', 'decision',
    'inference', 'conclusion', 'argument', 'explanation'
  ],
  'real-estate': [
    'real-estate', 'property', 'house', 'home', 'apartment', 'rent', 'sale',
    'value', 'price', 'market', 'listing', 'neighborhood', 'location'
  ],
  'social-media': [
    'social', 'media', 'twitter', 'facebook', 'instagram', 'linkedin', 'post',
    'tweet', 'share', 'like', 'follow', 'profile', 'timeline'
  ],
  'email': [
    'email', 'mail', 'message', 'send', 'receive', 'inbox', 'compose',
    'reply', 'forward', 'attach', 'spam', 'newsletter'
  ],
  'communication': [
    'communicate', 'message', 'chat', 'talk', 'discuss', 'converse', 'connect',
    'reach', 'contact', 'network', 'social', 'community'
  ],
  'validation': [
    'validate', 'verify', 'check', 'confirm', 'test', 'ensure', 'guarantee',
    'certify', 'approve', 'accept', 'authenticate', 'authorize'
  ],
  'geolocation': [
    'location', 'geography', 'gps', 'coordinates', 'position', 'place',
    'address', 'area', 'region', 'country', 'city', 'map'
  ],
  'forecast': [
    'forecast', 'predict', 'future', 'trend', 'outlook', 'projection',
    'estimate', 'anticipate', 'expect', 'plan', 'prepare'
  ],
  'blockchain': [
    'blockchain', 'crypto', 'bitcoin', 'ethereum', 'web3', 'defi', 'nft',
    'smart-contract', 'token', 'wallet', 'transaction', 'chain', 'network',
    'rpc', 'node', 'gas', 'mining', 'staking', 'dapp'
  ],
  'travel': [
    'travel', 'flight', 'airline', 'airport', 'hotel', 'booking', 'reservation',
    'trip', 'vacation', 'destination', 'itinerary', 'schedule', 'ticket',
    'transport', 'transportation', 'journey', 'tourism', 'cruise'
  ],
  'climate': [
    'climate', 'carbon', 'environment', 'sustainability', 'green', 'eco',
    'emissions', 'offset', 'removal', 'sequestration', 'renewable', 'energy',
    'impact', 'footprint', 'conservation', 'preservation'
  ],
  'domains': [
    'domain', 'website', 'url', 'hosting', 'dns', 'register', 'registration',
    '.com', '.io', '.ai', '.xyz', '.net', 'address', 'host', 'server',
    'web', 'online', 'internet', 'site', 'portal'
  ],
  'marketplace': [
    'marketplace', 'market', 'exchange', 'trade', 'buy', 'sell', 'hire',
    'freelance', 'gig', 'service', 'provider', 'contract', 'work', 'job',
    'talent', 'skill', 'expert', 'professional', 'consultant'
  ],
  'deployment': [
    'deploy', 'deployment', 'host', 'hosting', 'server', 'infrastructure',
    'cloud', 'container', 'docker', 'kubernetes', 'scale', 'production',
    'environment', 'app', 'application', 'service', 'api'
  ],
  'legal': [
    'legal', 'law', 'regulation', 'compliance', 'policy', 'government',
    'federal', 'statute', 'rule', 'guideline', 'requirement', 'mandate',
    'legislation', 'jurisdiction', 'court', 'case', 'precedent'
  ],
  'ai': [
    'ai', 'artificial-intelligence', 'machine-learning', 'ml', 'neural',
    'model', 'algorithm', 'intelligence', 'automation', 'smart', 'cognitive',
    'reasoning', 'learning', 'prediction', 'classification', 'detection'
  ]
};
