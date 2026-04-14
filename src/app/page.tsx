'use client';

import { useState } from 'react';
import { Tool } from '@/lib/tools';

interface ProviderInfo {
  isSupported: boolean;
  toolName: string;
  message: string;
  actionText: string;
  mailtoLink?: string;
  revenueLoss?: {
    dailyLoss: number;
    monthlyLoss: number;
    yearlyLoss: number;
  };
}

interface ExecutionResult {
  task: string;
  budget: number;
  status: string;
  executionTime: string;
  totalCost: number;
  remainingBudget: number;
  apisUsed: Tool[];
  paymentMethod: string;
}

interface LogEntry {
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

export default function Home() {
  const [task, setTask] = useState('');
  const [budget, setBudget] = useState(5);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [providerInfo, setProviderInfo] = useState<ProviderInfo | null>(null);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);

  // Parse log messages and determine their type
  const parseLogType = (message: string): LogEntry['type'] => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('error') || lowerMessage.includes('failed') || lowerMessage.includes('insufficient')) {
      return 'error';
    } else if (lowerMessage.includes('success') || lowerMessage.includes('completed') || lowerMessage.includes('successful')) {
      return 'success';
    } else if (lowerMessage.includes('warning') || lowerMessage.includes('losing') || lowerMessage.includes('revenue')) {
      return 'warning';
    } else {
      return 'info';
    }
  };

  // Convert string logs to LogEntry format
  const convertToLogEntries = (logMessages: string[]): LogEntry[] => {
    return logMessages.map(message => ({
      message,
      type: parseLogType(message)
    }));
  };

  const handleReset = () => {
    setTask('');
    setBudget(5);
    setLogs([]);
    setProviderInfo(null);
    setExecutionResult(null);
  };

  const handlePresetTask = (presetTask: string, presetBudget: number) => {
    setTask(presetTask);
    setBudget(presetBudget);
    setLogs([]);
    setProviderInfo(null);
    setExecutionResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim() && !isLoading) {
      setIsLoading(true);
      setLogs(convertToLogEntries([`Task submitted: ${task}`, `Budget set: $${budget}`, 'Initializing agent...']));

      try {
        // Call the API
        const response = await fetch('/api/run-agent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ task, budget }),
        });

        const result = await response.json();

        const newLogs = [
          ...result.data.logs,
          `Execution completed in ${result.data.executionTime}`,
          `Total cost: $${result.data.totalCost}`,
          `Status: ${result.data.status}`
        ];

        if (result.success) {
          setLogs(prevLogs => [
            ...prevLogs,
            ...convertToLogEntries(newLogs),
          ]);
          setProviderInfo(result.data.providerInfo);
          setExecutionResult({
            task: result.data.task,
            budget: result.data.budget,
            status: result.data.status,
            executionTime: result.data.executionTime,
            totalCost: result.data.totalCost,
            remainingBudget: result.data.remainingBudget,
            apisUsed: result.data.apisUsed,
            paymentMethod: result.data.paymentMethod
          });
        } else {
          setLogs(prevLogs => [...prevLogs, ...convertToLogEntries([`Error: ${result.error}`])]);
        }
      } catch (error) {
        console.error('API Error:', error);
        setLogs(prevLogs => [...prevLogs, ...convertToLogEntries(['Error: Failed to connect to agent API'])]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">API Hacker Agent</h1>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                AI-Powered Task Execution
              </h2>
              <p className="text-gray-600">
                Let our agent find the best APIs and complete your tasks within budget
              </p>
            </div>

            {/* Preset Tasks */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Start Tasks</h3>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => handlePresetTask('Scrape leads from tech company websites', 3)}
                  disabled={isLoading}
                  className="text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="font-medium text-gray-900">Scrape Leads</div>
                  <div className="text-sm text-gray-600">Extract contact info from tech company websites - $3 budget</div>
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetTask('Generate marketing content for a SaaS product', 5)}
                  disabled={isLoading}
                  className="text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="font-medium text-gray-900">Generate Content</div>
                  <div className="text-sm text-gray-600">Create marketing copy for SaaS product - $5 budget</div>
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetTask('Search for latest AI and machine learning trends', 2)}
                  disabled={isLoading}
                  className="text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="font-medium text-gray-900">Search Data</div>
                  <div className="text-sm text-gray-600">Research AI/ML trends and insights - $2 budget</div>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Enter your task..."
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">
                    Budget: ${budget}
                  </label>
                  <span className="text-xs text-gray-500">$1 - $10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Executing...
                  </>
                ) : (
                  'Execute Task'
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                disabled={isLoading}
                className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Reset
              </button>
            </form>

            {logs.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Execution Logs</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 max-h-40 overflow-y-auto">
                  {logs.map((log, index) => (
                    <div key={index} className={`text-sm font-mono flex items-start gap-2 ${
                      log.type === 'error' ? 'text-red-600' :
                      log.type === 'success' ? 'text-green-600' :
                      log.type === 'warning' ? 'text-yellow-600' :
                      'text-gray-600'
                    }`}>, , ,m
                      <span className="flex-shrink-0 mt-0.5">
                        {log.type === 'error' && '×'}
                        {log.type === 'success' && '×'}
                        {log.type === 'warning' && '×'}
                        {log.type === 'info' && '×'}
                      </span>
                      <span className="flex-1">{log.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {providerInfo && !providerInfo.isSupported && (
              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-lg font-semibold text-yellow-800 mb-1">
                      Provider Integration Opportunity
                    </h4>
                    <p className="text-sm text-yellow-700">
                      {providerInfo.message}
                    </p>
                  </div>

                  {providerInfo.revenueLoss && (
                    <div className="bg-yellow-100 rounded p-3">
                      <p className="text-sm font-medium text-yellow-800 mb-1">
                        Estimated Revenue Loss:
                      </p>
                      <div className="text-xs text-yellow-700 space-y-1">
                        <p> Daily: ${providerInfo.revenueLoss.dailyLoss.toFixed(2)}</p>
                        <p> Monthly: ${providerInfo.revenueLoss.monthlyLoss.toFixed(2)}</p>
                        <p> Yearly: ${providerInfo.revenueLoss.yearlyLoss.toFixed(2)}</p>
                      </div>
                    </div>
                  )}

                  <a
                    href={providerInfo.mailtoLink}
                    className="inline-flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {providerInfo.actionText}
                  </a>
                </div>
              </div>
            )}

            {providerInfo && providerInfo.isSupported && (
              <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="text-lg font-semibold text-green-800">
                      Optimal Choice
                    </h4>
                    <p className="text-sm text-green-700">
                      {providerInfo.message}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {executionResult && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-blue-800 mb-4">
                  Execution Summary
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Task:</span>
                      <span className="text-sm text-gray-900">{executionResult.task}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Status:</span>
                      <span className="text-sm text-green-600 font-medium">{executionResult.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Execution Time:</span>
                      <span className="text-sm text-gray-900">{executionResult.executionTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Payment Method:</span>
                      <span className="text-sm text-gray-900">{executionResult.paymentMethod}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Budget:</span>
                      <span className="text-sm text-gray-900">${executionResult.budget}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Total Cost:</span>
                      <span className="text-sm text-blue-600 font-medium">${executionResult.totalCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Remaining:</span>
                      <span className="text-sm text-green-600 font-medium">${executionResult.remainingBudget}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">APIs Used:</span>
                      <span className="text-sm text-gray-900">{executionResult.apisUsed.length}</span>
                    </div>
                  </div>
                </div>
                {executionResult.apisUsed.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <p className="text-sm font-medium text-gray-600 mb-2">APIs Used:</p>
                    <div className="flex flex-wrap gap-2">
                      {executionResult.apisUsed.map((api, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {api.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
