export interface User {
  id: string;
  name: string;
  email: string;
  role: 'restaurant' | 'charity';
  organizationName: string;
  address: string;
  phone: string;
  createdAt: Date;
}

export interface FoodItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
  title: string;
  description: string;
  category: 'prepared' | 'ingredients' | 'baked' | 'dairy' | 'produce';
  quantity: number;
  unit: string;
  expiresAt: Date;
  availableUntil: Date;
  status: 'available' | 'reserved' | 'claimed' | 'expired';
  estimatedValue: number;
  dietary: string[];
  allergens: string[];
  createdAt: Date;
  claimedBy?: string;
  claimedAt?: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'new_item' | 'expiring_soon' | 'claimed' | 'expired';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  relatedItemId?: string;
}

export interface Analytics {
  totalItemsShared: number;
  totalValueSaved: number;
  totalWeightSaved: number;
  itemsByCategory: Record<string, number>;
  monthlyTrends: Array<{
    month: string;
    items: number;
    value: number;
  }>;
  topRestaurants: Array<{
    name: string;
    items: number;
    value: number;
  }>;
  impactMetrics: {
    mealsProvided: number;
    co2Saved: number;
    wasteReduced: number;
  };
}