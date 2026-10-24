import { useState } from 'react';
import { Layout, FileText, BarChart3 } from 'lucide-react';
import Dashboard from './components/Dashboard/Dashboard';
import QueryInterface from './components/QueryInterface/QueryInterface';
import Analytics from './components/Analytics/Analytics';

type View = 'dashboard' | 'query' | 'analytics';

function App() {
  const [currentView, setCurrentView] = useState<View>('query');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">AI Tracking Engine</h1>
            </div>

            {/* Navigation */}
            <nav className="flex space-x-1">
              <button
                onClick={() => setCurrentView('query')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'query'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FileText className="w-5 h-5 inline mr-2" />
                Query
              </button>
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'dashboard'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Layout className="w-5 h-5 inline mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('analytics')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'analytics'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <BarChart3 className="w-5 h-5 inline mr-2" />
                Analytics
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'query' && <QueryInterface />}
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'analytics' && <Analytics />}
      </main>
    </div>
  );
}

export default App;
