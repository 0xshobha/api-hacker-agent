'use client';

import { useState } from 'react';

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

export default function Home() {
  const [task, setTask] = useState('');
  const [budget, setBudget] = useState(5);
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [providerInfo, setProviderInfo] = useState<ProviderInfo | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim() && !isLoading) {
      setIsLoading(true);
      setLogs([`Task submitted: ${task}`, `Budget set: $${budget}`, 'Initializing agent...']);

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

        if (result.success) {
          setLogs(prevLogs => [
            ...prevLogs,
            ...result.data.logs,
            `Execution completed in ${result.data.executionTime}`,
            `Total cost: $${result.data.totalCost}`,
            `Status: ${result.data.status}`
          ]);
          setProviderInfo(result.data.providerInfo);
        } else {
          setLogs(prevLogs => [
            ...prevLogs,
            `Error: ${result.error}`
          ]);
        }
      } catch (error) {
        console.error('API Error:', error);
        setLogs(prevLogs => [
          ...prevLogs,
          'Error: Failed to connect to agent API'
        ]);
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
            </form>

            {logs.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Execution Logs</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 max-h-40 overflow-y-auto">
                  {logs.map((log, index) => (
                    <div key={index} className="text-sm text-gray-600 font-mono">
                      {log}
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
          </div>
        </div>
      </main>
    </div>
  );
}
