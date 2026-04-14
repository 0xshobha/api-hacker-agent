export default function Home() {
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

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter your task..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Execute Task
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
