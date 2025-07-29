import React, { useState } from 'react';
import { Plus, Clock, TrendingUp, Package, AlertTriangle, CheckCircle } from 'lucide-react';
import { useFoodItems } from '../hooks/useFoodItems';
import { FoodItem } from '../types';
import { AddFoodItemModal } from './AddFoodItemModal';

export function RestaurantDashboard() {
  const { items, addItem, updateItemStatus } = useFoodItems();
  const [showAddModal, setShowAddModal] = useState(false);

  const stats = {
    totalActive: items.filter(item => item.status === 'available').length,
    expiringSoon: items.filter(item => {
      const hoursUntilExpiry = (new Date(item.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60);
      return hoursUntilExpiry <= 4 && item.status === 'available';
    }).length,
    totalValue: items.filter(item => item.status !== 'expired').reduce((sum, item) => sum + item.estimatedValue, 0),
    claimed: items.filter(item => item.status === 'claimed' || item.status === 'reserved').length
  };

  const getStatusColor = (status: FoodItem['status']) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'reserved': return 'bg-yellow-100 text-yellow-800';
      case 'claimed': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeUntilExpiry = (expiresAt: Date) => {
    const hoursUntil = (new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursUntil < 0) return 'Expired';
    if (hoursUntil < 1) return `${Math.round(hoursUntil * 60)}m`;
    if (hoursUntil < 24) return `${Math.round(hoursUntil)}h`;
    return `${Math.round(hoursUntil / 24)}d`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Restaurant Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your surplus food inventory</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Food Item</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Items</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalActive}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{stats.expiringSoon}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${stats.totalValue}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Claimed</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.claimed}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Food Items List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Your Food Items</h2>
          <p className="text-gray-600 mt-1">Track and manage your surplus inventory</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expires
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Package className="w-12 h-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No items yet</h3>
                      <p className="text-gray-500 mb-4">Start by adding your first surplus food item</p>
                      <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Item</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{item.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {getTimeUntilExpiry(item.expiresAt)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ${item.estimatedValue}
                    </td>
                    <td className="px-6 py-4">
                      {item.status === 'available' && (
                        <select
                          onChange={(e) => updateItemStatus(item.id, e.target.value as FoodItem['status'])}
                          className="text-sm border border-gray-300 rounded-md px-2 py-1"
                          defaultValue={item.status}
                        >
                          <option value="available">Available</option>
                          <option value="expired">Mark Expired</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Food Item Modal */}
      {showAddModal && (
        <AddFoodItemModal
          onClose={() => setShowAddModal(false)}
          onAdd={addItem}
        />
      )}
    </div>
  );
}