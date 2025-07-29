import React from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { LoginForm } from './components/LoginForm';
import { Layout } from './components/Layout';
import { RestaurantDashboard } from './components/RestaurantDashboard';
import { CharityDashboard } from './components/CharityDashboard';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { BarChart3 } from 'lucide-react';
import { useState } from 'react';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<'dashboard' | 'analytics'>('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-2xl">FS</span>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <Layout>
      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                currentView === 'dashboard'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {user.role === 'restaurant' ? 'Manage Inventory' : 'Browse Food'}
            </button>
            <button
              onClick={() => setCurrentView('analytics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                currentView === 'analytics'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      {currentView === 'analytics' ? (
        <AnalyticsDashboard />
      ) : user.role === 'restaurant' ? (
        <RestaurantDashboard />
      ) : (
        <CharityDashboard />
      )}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;