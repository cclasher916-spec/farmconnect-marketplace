import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Cart, Product, Notification } from '@/types';

interface AppState {
  cart: Cart;
  notifications: Notification[];
  searchQuery: string;
  selectedCategory: string | null;
  loading: boolean;
}

type AppAction = 
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity?: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_CATEGORY'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean };

interface AppContextType extends AppState {
  dispatch: React.Dispatch<AppAction>;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationRead: (notificationId: string) => void;
  clearNotifications: () => void;
  setSearchQuery: (query: string) => void;
  setCategory: (category: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

const initialState: AppState = {
  cart: {
    items: [],
    totalItems: 0,
    totalAmount: 0,
  },
  notifications: [],
  searchQuery: '',
  selectedCategory: null,
  loading: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, quantity = 1 } = action.payload;
      const existingItemIndex = state.cart.items.findIndex(
        item => item.productId === product.id
      );

      let updatedItems;
      if (existingItemIndex >= 0) {
        updatedItems = state.cart.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedItems = [
          ...state.cart.items,
          { productId: product.id, product, quantity },
        ];
      }

      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = updatedItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      return {
        ...state,
        cart: {
          items: updatedItems,
          totalItems,
          totalAmount,
        },
      };
    }

    case 'REMOVE_FROM_CART': {
      const updatedItems = state.cart.items.filter(
        item => item.productId !== action.payload
      );
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = updatedItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      return {
        ...state,
        cart: {
          items: updatedItems,
          totalItems,
          totalAmount,
        },
      };
    }

    case 'UPDATE_CART_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return appReducer(state, { type: 'REMOVE_FROM_CART', payload: productId });
      }

      const updatedItems = state.cart.items.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      );
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = updatedItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      return {
        ...state,
        cart: {
          items: updatedItems,
          totalItems,
          totalAmount,
        },
      };
    }

    case 'CLEAR_CART':
      return {
        ...state,
        cart: initialState.cart,
      };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [
          {
            ...action.payload,
            id: Date.now().toString(),
            createdAt: new Date(),
          },
          ...state.notifications,
        ],
      };

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        ),
      };

    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
      };

    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
      };

    case 'SET_CATEGORY':
      return {
        ...state,
        selectedCategory: action.payload,
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };

    default:
      return state;
  }
}

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('farmconnect_cart');
    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart);
        // Restore cart items one by one to trigger proper calculation
        cart.items.forEach((item: any) => {
          dispatch({
            type: 'ADD_TO_CART',
            payload: { product: item.product, quantity: item.quantity },
          });
        });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('farmconnect_cart', JSON.stringify(state.cart));
  }, [state.cart]);

  const addToCart = (product: Product, quantity = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification as Notification });
  };

  const markNotificationRead = (notificationId: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
  };

  const clearNotifications = () => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
  };

  const setSearchQuery = (query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  };

  const setCategory = (category: string | null) => {
    dispatch({ type: 'SET_CATEGORY', payload: category });
  };

  const value: AppContextType = {
    ...state,
    dispatch,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    addNotification,
    markNotificationRead,
    clearNotifications,
    setSearchQuery,
    setCategory,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};