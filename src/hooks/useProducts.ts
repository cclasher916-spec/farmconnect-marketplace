import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { Product, ProductCategory, SearchFilters } from '@/types';
import { useFirestoreOperations, useCollection } from './useFirestore';

export function useProducts(filters?: SearchFilters) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        let q = collection(db, 'products');
        const constraints: any[] = [where('availability', '==', true)];

        if (filters?.category) {
          constraints.push(where('category', '==', filters.category));
        }

        if (filters?.organic !== undefined) {
          constraints.push(where('organic', '==', filters.organic));
        }

        // Add sorting
        if (filters?.sortBy) {
          const direction = filters.sortOrder === 'desc' ? 'desc' : 'asc';
          constraints.push(orderBy(filters.sortBy, direction));
        } else {
          constraints.push(orderBy('createdAt', 'desc'));
        }

        const productsQuery = query(q, ...constraints);
        const snapshot = await getDocs(productsQuery);
        
        let productsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];

        // Apply price filters (Firestore doesn't support range queries with other filters)
        if (filters?.minPrice !== undefined) {
          productsList = productsList.filter(p => p.price >= filters.minPrice!);
        }
        if (filters?.maxPrice !== undefined) {
          productsList = productsList.filter(p => p.price <= filters.maxPrice!);
        }

        setProducts(productsList);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [JSON.stringify(filters)]);

  return { products, loading, error, refetch: () => window.location.reload() };
}

export function useFarmerProducts(farmerId: string) {
  return useCollection<Product>('products', [
    where('farmerId', '==', farmerId),
    orderBy('createdAt', 'desc'),
  ]);
}

export function useProductOperations() {
  return useFirestoreOperations('products');
}

export function useProductCategories() {
  const categories: { value: ProductCategory; label: string }[] = [
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'grains', label: 'Grains' },
    { value: 'pulses', label: 'Pulses' },
    { value: 'spices', label: 'Spices' },
    { value: 'leafy_greens', label: 'Leafy Greens' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'herbs', label: 'Herbs' },
  ];

  return categories;
}