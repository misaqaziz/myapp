import React, { useState } from 'react';
import { Search, Filter, Clock, MapPin, Heart, Package, TrendingUp, Users } from 'lucide-react';
import { useFoodItems } from '../hooks/useFoodItems';
import { FoodItem } from '../types';

export function CharityDashboard() {
  const { items, claimItem } = useFoodItems();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDietary, setSelectedDietary] = useState<string>('all');

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesDietary = selectedDietary === 'all' || item.dietary.includes(selectedDietary);
    
    return matchesSearch && matchesCategory && matchesDietary;
  });

  const stats = {
    availableItems: items.length,
    totalValue: items.reduce((sum, item) => sum + item.estimatedValue, 0),
    expiringToday: items.filter(item => {
      const hoursUntilExpiry = (new Date(item.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60);
      return hoursUntilExpiry <= 24;
    }).length,
    restaurants: [...new Set(items.map(item => item.restaurantName))].length
  };

  const getTimeUntilExpiry = (expiresAt: Date) => {
    const hoursUntil = (new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursUntil < 1) return `${Math.round(hoursUntil * 60)}m`;
    if (hoursUntil < 24) return `${Math.round(hoursUntil)}h`;
    return `${Math.round(hoursUntil / 24)}d`;
  };

  const getDietaryTags = (dietary: string[]) => {
    return dietary.map(tag => (
      <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        {tag}
      </span>
    ));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Available Food</h1>
        <p className="text-gray-600 mt-1">Discover surplus food from local restaurants</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Items</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.availableItems}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-green-600 mt-1">${stats.totalValue}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expiring Today</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{stats.expiringToday}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Partner Restaurants</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{stats.restaurants}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search food items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="w-full lg:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="prepared">Prepared</option>
              <option value="ingredients">Ingredients</option>
              <option value="baked">Baked Goods</option>
              <option value="dairy">Dairy</option>
              <option value="produce">Produce</option>
            </select>
          </div>

          {/* Dietary Filter */}
          <div className="w-full lg:w-48">
            <select
              value={selectedDietary}
              onChange={(e) => setSelectedDietary(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Dietary</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="gluten-free">Gluten-Free</option>
            </select>
          </div>
        </div>
      </div>

      {/* Food Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <Package className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize ml-2">
                    {item.category}
                  </span>
                </div>

                {/* Restaurant */}
                <div className="flex items-center space-x-2 mb-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{item.restaurantName}</span>
                </div>

                {/* Quantity & Value */}
                <div className="flex justify-between items-center mb-3">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{item.quantity} {item.unit}</span>
                  </div>
                  <div className="text-sm font-medium text-green-600">
                    ${item.estimatedValue} value
                  </div>
                </div>

                {/* Expiry */}
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-gray-700">
                    Expires in <span className="font-medium text-orange-600">{getTimeUntilExpiry(item.expiresAt)}</span>
                  </span>
                </div>

                {/* Dietary Tags */}
                {item.dietary.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {getDietaryTags(item.dietary)}
                  </div>
                )}

                {/* Allergens */}
                {item.allergens.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500">
                      Contains: {item.allergens.join(', ')}
                    </p>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={() => claimItem(item.id)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Heart className="w-4 h-4" />
                  <span>Reserve Item</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}