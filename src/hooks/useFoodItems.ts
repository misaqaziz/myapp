import { useState, useEffect } from 'react';
import { FoodItem } from '../types';
import { useAuth } from './useAuth';

const mockFoodItems: FoodItem[] = [
  {
    id: '1',
    restaurantId: '1',
    restaurantName: 'Bella Italia',
    title: 'Fresh Pasta Primavera',
    description: 'Homemade fettuccine with seasonal vegetables, made fresh today',
    category: 'prepared',
    quantity: 12,
    unit: 'portions',
    expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
    availableUntil: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
    status: 'available',
    estimatedValue: 96,
    dietary: ['vegetarian'],
    allergens: ['gluten', 'eggs'],
    createdAt: new Date(Date.now() - 30 * 60 * 1000)
  },
  {
    id: '2',
    restaurantId: '1',
    restaurantName: 'Bella Italia',
    title: 'Mixed Green Salads',
    description: 'Fresh organic mixed greens with house dressing',
    category: 'prepared',
    quantity: 8,
    unit: 'portions',
    expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    availableUntil: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
    status: 'available',
    estimatedValue: 48,
    dietary: ['vegetarian', 'vegan', 'gluten-free'],
    allergens: [],
    createdAt: new Date(Date.now() - 45 * 60 * 1000)
  },
  {
    id: '3',
    restaurantId: '1',
    restaurantName: 'Bella Italia',
    title: 'Artisan Bread Loaves',
    description: 'Freshly baked sourdough and whole wheat loaves',
    category: 'baked',
    quantity: 6,
    unit: 'loaves',
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    availableUntil: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
    status: 'available',
    estimatedValue: 42,
    dietary: [],
    allergens: ['gluten'],
    createdAt: new Date(Date.now() - 60 * 60 * 1000)
  },
  {
    id: '4',
    restaurantId: '1',
    restaurantName: 'Bella Italia',
    title: 'Vegetable Soup',
    description: 'Hearty tomato-based vegetable soup, perfect for cold days',
    category: 'prepared',
    quantity: 15,
    unit: 'portions',
    expiresAt: new Date(Date.now() - 30 * 60 * 1000), // Expired 30 minutes ago
    availableUntil: new Date(Date.now() - 60 * 60 * 1000), // Was available until 1 hour ago
    status: 'claimed',
    estimatedValue: 90,
    dietary: ['vegetarian', 'vegan'],
    allergens: [],
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    claimedBy: '2',
    claimedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  }
];

export function useFoodItems() {
  const { user } = useAuth();
  const [items, setItems] = useState<FoodItem[]>([]);

  useEffect(() => {
    if (user?.role === 'restaurant') {
      // Restaurant sees their own items
      setItems(mockFoodItems.filter(item => item.restaurantId === user.id));
    } else if (user?.role === 'charity') {
      // Charity sees all available items
      setItems(mockFoodItems.filter(item => item.status === 'available'));
    }
  }, [user]);

  const addItem = (newItem: Omit<FoodItem, 'id' | 'restaurantId' | 'restaurantName' | 'createdAt' | 'status'>) => {
    if (!user || user.role !== 'restaurant') return;

    const item: FoodItem = {
      ...newItem,
      id: Date.now().toString(),
      restaurantId: user.id,
      restaurantName: user.organizationName,
      status: 'available',
      createdAt: new Date()
    };

    setItems(prev => [item, ...prev]);
  };

  const claimItem = (itemId: string) => {
    if (!user || user.role !== 'charity') return;

    setItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              status: 'reserved' as const,
              claimedBy: user.id,
              claimedAt: new Date()
            }
          : item
      )
    );
  };

  const updateItemStatus = (itemId: string, status: FoodItem['status']) => {
    setItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, status } : item
      )
    );
  };

  return {
    items,
    addItem,
    claimItem,
    updateItemStatus
  };
}