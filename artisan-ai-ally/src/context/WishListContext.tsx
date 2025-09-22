import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

interface WishlistContextType {
  wishlist: any[];
  fetchWishlist: () => Promise<void>;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const [wishlist, setWishlist] = useState<any[]>([]);

  // Fetch wishlist
  const fetchWishlist = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setWishlist(data.products || []);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    }
  };

  // Add to wishlist
  const addToWishlist = async (productId: string) => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/wishlist/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (res.ok) {
        setWishlist(data.products || []); // ✅ update instantly
      }
    } catch (err) {
      console.error("Error adding to wishlist:", err);
    }
  };

  // Remove from wishlist
  const removeFromWishlist = async (productId: string) => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/wishlist/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (res.ok) {
        setWishlist(data.products || []); // ✅ update instantly
      }
    } catch (err) {
      console.error("Error removing from wishlist:", err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [token]);

  return (
    <WishlistContext.Provider value={{ wishlist, fetchWishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
};
