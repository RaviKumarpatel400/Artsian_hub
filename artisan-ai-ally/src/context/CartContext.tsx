import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

interface CartItem {
  product: any;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: any, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, type: "inc" | "dec") => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  isInCart: (productId: string) => boolean;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // ✅ Fixed fetchCart function
  const fetchCart = async () => {
    if (!token || !isAuthenticated) {
      console.log('❌ No token or not authenticated');
      setCartItems([]);
      return;
    }
    
    try {
      console.log('🔄 Fetching cart...');
      const res = await fetch("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const data = await res.json();
      console.log('📦 Cart data received:', data);
      
      if (res.ok) {
        const products = data.products || [];
        console.log('✅ Products to set:', products);
        
        // ✅ Validate each product
        const validProducts = products.filter((item: any) => {
          if (!item.product) {
            console.warn('⚠️ Skipping item with null product:', item);
            return false;
          }
          return true;
        });
        
        setCartItems(validProducts);
        console.log('✅ Cart items updated:', validProducts);
      }
    } catch (err) {
      console.error("❌ Error fetching cart:", err);
      setCartItems([]);
    }
  };

  // ✅ Fixed useEffect with proper dependencies
  useEffect(() => {
    console.log('🔄 Auth state changed:', { isAuthenticated, hasToken: !!token });
    
    if (isAuthenticated && token) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated, token]); // ✅ Proper dependencies

  // ✅ Fixed addToCart function
  const addToCart = async (product: any, quantity: number = 1) => {
    if (!token || !isAuthenticated) {
      console.error('❌ Cannot add to cart: Not authenticated');
      return;
    }
    
    console.log('🛒 Adding to cart:', { productId: product._id, quantity });
    
    try {
      const res = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id, quantity }),
      });
      
      const data = await res.json();
      console.log('📦 Add response:', data);
      
      if (res.ok) {
        // ✅ CRITICAL: Refresh cart data after adding
        await fetchCart();
      } else {
        console.error('❌ Server error:', data.message);
      }
    } catch (err) {
      console.error("❌ Network error adding to cart:", err);
    }
  };

  // ✅ Enhanced remove function
  const removeFromCart = async (productId: string) => {
    if (!token) return;
    
    try {
      const res = await fetch("http://localhost:5000/api/cart/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });
      
      if (res.ok) {
        await fetchCart(); // ✅ Refresh after remove
      }
    } catch (err) {
      console.error("❌ Error removing from cart:", err);
    }
  };

  // ✅ Enhanced update function
  const updateQuantity = async (productId: string, type: "inc" | "dec") => {
    if (!token) return;
    
    try {
      const res = await fetch("http://localhost:5000/api/cart/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, type }),
      });
      
      if (res.ok) {
        await fetchCart(); // ✅ Refresh after update
      }
    } catch (err) {
      console.error("❌ Error updating quantity:", err);
    }
  };

  // ✅ Enhanced clear function
  const clearCart = async () => {
    if (!token) return;
    
    try {
      const res = await fetch("http://localhost:5000/api/cart/clear", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        setCartItems([]);
      }
    } catch (err) {
      console.error("❌ Error clearing cart:", err);
    }
  };

  // ✅ Safe calculation functions
  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => {
      return sum + (item.product?.price || 0) * (item.quantity || 0);
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  };

  const isInCart = (productId: string) => {
    return cartItems.some((item) => item.product?._id === productId);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        isInCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
