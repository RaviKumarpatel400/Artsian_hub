import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trash2, Heart } from "lucide-react";

type WishlistItem = {
  product: {
    _id: string;
    name: string;
    image: string;
    price: number;
    artisan?: string;
  };
};

const Wishlist = () => {
  const { token } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  // ---- Fetch Wishlist ----
  const fetchWishlist = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setWishlist(data?.products || []);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      setWishlist([]);
    }
  };

  // ---- Remove from Wishlist ----
  const removeFromWishlist = async (productId: string) => {
    try {
      await fetch("http://localhost:5000/api/wishlist/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });
      // Always re-fetch to keep UI in sync
      await fetchWishlist();
    } catch (err) {
      console.error("Error removing wishlist item:", err);
    }
  };

  useEffect(() => {
    fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (!wishlist.length) {
    return (
      <div className="text-center py-20">
        <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold">Your Wishlist is Empty</h2>
        <p className="text-gray-600">Start adding products you love!</p>
        <Link to="/" className="mt-6 inline-block">
          <Button className="bg-orange-600 hover:bg-orange-700">
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
      <div className="grid gap-4">
        {wishlist.map((item) => (
          <div
            key={item.product._id}
            className="flex items-center justify-between border p-4 rounded-lg shadow-sm"
          >
            <Link
              to={`/product/${item.product._id}`}
              className="flex items-center space-x-4"
            >
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-20 h-20 rounded object-cover"
              />
              <div>
                <h3 className="font-semibold">{item.product.name}</h3>
                {item.product.artisan && (
                  <p className="text-gray-600">by {item.product.artisan}</p>
                )}
                <p className="text-gray-600">${item.product.price}</p>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600"
              onClick={() => removeFromWishlist(item.product._id)}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
