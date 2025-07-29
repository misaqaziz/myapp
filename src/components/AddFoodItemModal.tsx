import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { FoodItem } from '../types';

interface AddFoodItemModalProps {
  onClose: () => void;
  onAdd: (item: Omit<FoodItem, 'id' | 'restaurantId' | 'restaurantName' | 'createdAt' | 'status'>) => void;
}

export function AddFoodItemModal({ onClose, onAdd }: AddFoodItemModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'prepared' as FoodItem['category'],
    quantity: '',
    unit: '',
    expiresAt: '',
    availableUntil: '',
    estimatedValue: '',
    dietary: [] as string[],
    allergens: [] as string[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    { value: 'prepared', label: 'Prepared Food' },
    { value: 'ingredients', label: 'Ingredients' },
    { value: 'baked', label: 'Baked Goods' },
    { value: 'dairy', label: 'Dairy Products' },
    { value: 'produce', label: 'Fresh Produce' }
  ];

  const dietaryOptions = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free'];
  const allergenOptions = ['gluten', 'dairy', 'eggs', 'nuts', 'soy', 'shellfish', 'fish'];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.quantity || Number(formData.quantity) <= 0) newErrors.quantity = 'Valid quantity is required';
    if (!formData.unit.trim()) newErrors.unit = 'Unit is required';
    if (!formData.expiresAt) newErrors.expiresAt = 'Expiry date is required';
    if (!formData.availableUntil) newErrors.availableUntil = 'Available until date is required';
    if (!formData.estimatedValue || Number(formData.estimatedValue) <= 0) newErrors.estimatedValue = 'Valid estimated value is required';

    const expiryDate = new Date(formData.expiresAt);
    const availableDate = new Date(formData.availableUntil);
    const now = new Date();

    if (expiryDate <= now) newErrors.expiresAt = 'Expiry date must be in the future';
    if (availableDate <= now) newErrors.availableUntil = 'Available until date must be in the future';
    if (availableDate >= expiryDate) newErrors.availableUntil = 'Available until must be before expiry date';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onAdd({
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      quantity: Number(formData.quantity),
      unit: formData.unit.trim(),
      expiresAt: new Date(formData.expiresAt),
      availableUntil: new Date(formData.availableUntil),
      estimatedValue: Number(formData.estimatedValue),
      dietary: formData.dietary,
      allergens: formData.allergens
    });

    onClose();
  };

  const handleDietaryChange = (option: string) => {
    setFormData(prev => ({
      ...prev,
      dietary: prev.dietary.includes(option)
        ? prev.dietary.filter(d => d !== option)
        : [...prev.dietary, option]
    }));
  };

  const handleAllergenChange = (option: string) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.includes(option)
        ? prev.allergens.filter(a => a !== option)
        : [...prev.allergens, option]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add Food Item</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., Fresh Pasta Primavera"
              />
              {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe the food item, including ingredients and preparation method"
              />
              {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as FoodItem['category'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Value *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.estimatedValue}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedValue: e.target.value }))}
                  className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.estimatedValue ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.estimatedValue && <p className="text-red-600 text-sm mt-1">{errors.estimatedValue}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.quantity ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="1"
              />
              {errors.quantity && <p className="text-red-600 text-sm mt-1">{errors.quantity}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit *
              </label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.unit ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., portions, kg, loaves"
              />
              {errors.unit && <p className="text-red-600 text-sm mt-1">{errors.unit}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expires At *
              </label>
              <input
                type="datetime-local"
                value={formData.expiresAt}
                onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.expiresAt ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.expiresAt && <p className="text-red-600 text-sm mt-1">{errors.expiresAt}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Until *
              </label>
              <input
                type="datetime-local"
                value={formData.availableUntil}
                onChange={(e) => setFormData(prev => ({ ...prev, availableUntil: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.availableUntil ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.availableUntil && <p className="text-red-600 text-sm mt-1">{errors.availableUntil}</p>}
            </div>
          </div>

          {/* Dietary Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Dietary Information
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {dietaryOptions.map(option => (
                <label key={option} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.dietary.includes(option)}
                    onChange={() => handleDietaryChange(option)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Allergens */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Contains Allergens
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {allergenOptions.map(option => (
                <label key={option} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.allergens.includes(option)}
                    onChange={() => handleAllergenChange(option)}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}