import { useState, useEffect } from 'react';
import { Notification } from '../types';
import { useAuth } from './useAuth';

const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    type: 'expiring_soon',
    title: 'Items Expiring Soon',
    message: '3 items will expire in the next 2 hours',
    read: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    relatedItemId: 'item-1'
  },
  {
    id: '2',
    userId: '2',
    type: 'new_item',
    title: 'New Surplus Available',
    message: 'Bella Italia has added fresh pasta and salads',
    read: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
    relatedItemId: 'item-2'
  },
  {
    id: '3',
    userId: '1',
    type: 'claimed',
    title: 'Item Claimed',
    message: 'Community Food Bank claimed your vegetable soup',
    read: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    relatedItemId: 'item-3'
  }
];

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (user) {
      const userNotifications = mockNotifications.filter(n => n.userId === user.id);
      setNotifications(userNotifications);
    }
  }, [user]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead
  };
}