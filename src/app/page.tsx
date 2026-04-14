'use client';

import { useState } from 'react';

export default function Home() {
  const [task, setTask] = useState('');
  const [budget, setBudget] = useState(5);
  const [logs, setLogs] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim()) {
      setLogs([
        `Task submitted: ${task}`,
        `Budget set: $${budget}`,
        'Analyzing task requirements...',
        'Searching for optimal APIs...',
        'Executing task within budget constraints...'
      ]);
      console.log('Task:', task, 'Budget:', budget);
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
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Execute Task
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
          </div>
        </div>
      </main>
    </div>
  );
}
