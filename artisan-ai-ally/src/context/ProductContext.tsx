import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/data/products';
import { ProductService } from '@/services/productService';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedProducts = await ProductService.getProducts();
      setProducts(fetchedProducts);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const newProduct = await ProductService.addProduct(productData);
      setProducts(prev => [newProduct, ...prev]);
    } catch (err) {
      throw new Error('Failed to add product');
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  return (
    <ProductContext.Provider value={{
      products,
      loading,
      error,
      addProduct,
      refreshProducts
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
