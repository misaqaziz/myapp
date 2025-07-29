import React from 'react';
import { TrendingUp, Package, DollarSign, Leaf, Users, Calendar } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function AnalyticsDashboard() {
  const { user } = useAuth();

  // Mock analytics data - in a real app, this would come from an API
  const analytics = {
    totalItemsShared: 156,
    totalValueSaved: 8240,
    totalWeightSaved: 850, // kg
    itemsByCategory: {
      prepared: 65,
      ingredients: 32,
      baked: 28,
      dairy: 18,
      produce: 13
    },
    monthlyTrends: [
      { month: 'Jan', items: 45, value: 2400 },
      { month: 'Feb', items: 52, value: 2800 },
      { month: 'Mar', items: 38, value: 2200 },
      { month: 'Apr', items: 61, value: 3200 },
      { month: 'May', items: 49, value: 2650 },
      { month: 'Jun', items: 73, value: 3890 }
    ],
    topRestaurants: [
      { name: 'Bella Italia', items: 45, value: 2400 },
      { name: 'Green Garden Cafe', items: 38, value: 1950 },
      { name: 'Coastal Kitchen', items: 32, value: 1680 },
      { name: 'Urban Bistro', items: 28, value: 1520 }
    ],
    impactMetrics: {
      mealsProvided: 624, // 4 meals per item average
      co2Saved: 1275, // kg CO2 equivalent
      wasteReduced: 850 // kg
    }
  };

  const categoryColors = {
    prepared: 'bg-blue-500',
    ingredients: 'bg-green-500',
    baked: 'bg-yellow-500',
    dairy: 'bg-purple-500',
    produce: 'bg-orange-500'
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-1">Track your impact and system performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Items Shared</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{analytics.totalItemsShared}</p>
              <p className="text-xs text-green-600 mt-1">+12% from last month</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Value Saved</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${analytics.totalValueSaved.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">+18% from last month</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Meals Provided</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{analytics.impactMetrics.mealsProvided}</p>
              <p className="text-xs text-blue-600 mt-1">~4 meals per item</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">CO₂ Saved</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{analytics.impactMetrics.co2Saved}kg</p>
              <p className="text-xs text-green-600 mt-1">Environmental impact</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Trends */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Trends</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          
          <div className="space-y-4">
            {analytics.monthlyTrends.map((month, index) => (
              <div key={month.month} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600">{month.month}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{month.items} items</p>
                    <p className="text-xs text-gray-500">${month.value} value</p>
                  </div>
                </div>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(month.items / 75) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className={`text-xs ${index > 0 && month.items > analytics.monthlyTrends[index - 1].items ? 'text-green-600' : 'text-gray-500'}`}>
                  {index > 0 && month.items > analytics.monthlyTrends[index - 1].items ? '+' : ''}{month.items}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Items by Category</h3>
            <Package className="w-5 h-5 text-blue-500" />
          </div>
          
          <div className="space-y-4">
            {Object.entries(analytics.itemsByCategory).map(([category, count]) => {
              const percentage = (count / analytics.totalItemsShared) * 100;
              return (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${categoryColors[category as keyof typeof categoryColors]}`}></div>
                    <span className="text-sm font-medium text-gray-900 capitalize">{category}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 w-20">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${categoryColors[category as keyof typeof categoryColors]}`} 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Performing Restaurants */}
      {user?.role === 'charity' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Partner Restaurants</h3>
            <Users className="w-5 h-5 text-purple-500" />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 text-sm font-medium text-gray-600">Restaurant</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-600">Items Shared</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-600">Total Value</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-600">Performance</th>
                </tr>
              </thead>
              <tbody>
                {analytics.topRestaurants.map((restaurant, index) => (
                  <tr key={restaurant.name} className="border-b border-gray-100 last:border-0">
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-purple-600">#{index + 1}</span>
                        </div>
                        <span className="font-medium text-gray-900">{restaurant.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-gray-600">{restaurant.items}</td>
                    <td className="py-4 text-gray-600">${restaurant.value}</td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full" 
                            style={{ width: `${(restaurant.items / analytics.topRestaurants[0].items) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {Math.round((restaurant.items / analytics.totalItemsShared) * 100)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Environmental Impact */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Environmental Impact</h3>
          <Leaf className="w-5 h-5 text-green-500" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{analytics.impactMetrics.co2Saved}kg</p>
            <p className="text-sm text-gray-600">CO₂ Emissions Saved</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Package className="w-8 h-8 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{analytics.impactMetrics.wasteReduced}kg</p>
            <p className="text-sm text-gray-600">Food Waste Reduced</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-8 h-8 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{analytics.impactMetrics.mealsProvided}</p>
            <p className="text-sm text-gray-600">Meals Provided</p>
          </div>
        </div>
      </div>
    </div>
  );
}