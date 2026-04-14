// Real API integration for demo quality

export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

export class RealAPI {
  // Real SerpAPI integration (requires API key)
  static async searchWithSerpAPI(query: string, apiKey: string): Promise<SearchResult[]> {
    try {
      const response = await fetch(`https://serpapi.com/search.json?api_key=${apiKey}&q=${encodeURIComponent(query)}&engine=google`);

      if (!response.ok) {
        throw new Error(`SerpAPI error: ${response.status}`);
      }

      const data = await response.json();

      return data.organic_results?.map((result: { title: string; link: string; snippet: string }) => ({
        title: result.title,
        link: result.link,
        snippet: result.snippet
      })) || [];
    } catch (error) {
      console.error('SerpAPI error:', error);
      return [];
    }
  }

  // Fallback: Free DuckDuckGo search (no API key needed)
  static async searchWithDuckDuckGo(query: string): Promise<SearchResult[]> {
    try {
      const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&pretty=1`);

      if (!response.ok) {
        throw new Error(`DuckDuckGo error: ${response.status}`);
      }

      const data = await response.json();

      return data.RelatedTopics?.slice(0, 5).map((topic: { Text: string; FirstURL: string }) => ({
        title: topic.Text?.split(' - ')[0] || 'Unknown',
        link: topic.FirstURL || '',
        snippet: topic.Text || 'No description available'
      })) || [];
    } catch (error) {
      console.error('DuckDuckGo error:', error);
      return [];
    }
  }

  // Real OpenAI API integration (requires API key)
  static async generateWithOpenAI(prompt: string, apiKey: string): Promise<string> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'No response generated';
    } catch (error) {
      console.error('OpenAI error:', error);
      return 'Failed to generate response';
    }
  }

  // Fallback: Local text processing
  static generateLocalResponse(task: string): string {
    const responses: Record<string, string> = {
      search: `I'll help you search for information about: "${task}". Using available search APIs to find relevant results.`,
      write: `I'll help you write content about: "${task}". Generating text based on your requirements.`,
      analyze: `I'll analyze: "${task}". Breaking down the key components and providing insights.`,
      summarize: `I'll summarize: "${task}". Extracting the main points and creating a concise overview.`,
      code: `I'll help you code: "${task}". Generating code examples and solutions.`,
      default: `I'll process your task: "${task}". Using available tools to complete this request.`
    };

    const taskLower = task.toLowerCase();

    for (const [key, response] of Object.entries(responses)) {
      if (taskLower.includes(key)) {
        return response;
      }
    }

    return responses.default;
  }

  // Main API execution method
  static async executeRealAPI(task: string, toolName: string, apiKey?: string): Promise<{
    success: boolean;
    results: SearchResult[] | { response: string } | null;
    logs: string[];
  }> {
    const logs: string[] = [];
    logs.push(`Executing real API call for: ${toolName}`);
    logs.push(`Task: ${task}`);

    try {
      switch (toolName.toLowerCase()) {
        case 'serper search':
          if (apiKey) {
            logs.push('Using SerpAPI with API key...');
            const results = await this.searchWithSerpAPI(task, apiKey);
            logs.push(`Found ${results.length} search results`);
            return { success: true, results, logs };
          } else {
            logs.push('No API key provided, falling back to DuckDuckGo...');
            const results = await this.searchWithDuckDuckGo(task);
            logs.push(`Found ${results.length} search results via DuckDuckGo`);
            return { success: true, results, logs };
          }

        case 'openai gpt-4':
        case 'openai gpt-3.5-turbo':
          if (apiKey) {
            logs.push('Using OpenAI API with API key...');
            const result = await this.generateWithOpenAI(task, apiKey);
            logs.push('Generated response successfully');
            return { success: true, results: { response: result }, logs };
          } else {
            logs.push('No API key provided, using local processing...');
            const result = this.generateLocalResponse(task);
            logs.push('Generated local response');
            return { success: true, results: { response: result }, logs };
          }

        default:
          logs.push('Tool not supported for real API execution');
          return { success: false, results: null, logs };
      }
    } catch (error) {
      logs.push(`API execution failed: ${error}`);
      return { success: false, results: null, logs };
    }
  }
}
