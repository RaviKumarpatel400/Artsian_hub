import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Star, ShoppingCart, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  artisan: string;
  image?: string;
  description?: string;
  rating?: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { isAuthenticated, token } = useAuth();
  const { toast } = useToast();
  const [inCart, setInCart] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  // ✅ Check if product is already in wishlist on mount
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!token) return;
      try {
        const res = await fetch("http://localhost:5000/api/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.products?.some((item: any) => item.product._id === product._id)) {
          setInWishlist(true);
        }
      } catch (err) {
        console.error("Error checking wishlist:", err);
      }
    };

    fetchWishlist();
  }, [token, product._id]);

  // ✅ Add to Cart
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !token) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to cart.",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id }),
      });

      const data = await res.json();
      if (res.ok) {
        setInCart(true);
        toast({
          title: "Added to Cart!",
          description: `${product.name} has been added to your cart.`,
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to add item to cart",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  // ✅ Toggle Wishlist (Add/Remove)
  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !token) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to manage your wishlist.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (inWishlist) {
        // Remove from wishlist
        const res = await fetch("http://localhost:5000/api/wishlist/remove", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: product._id }),
        });

        const data = await res.json();
        if (res.ok) {
          setInWishlist(false);
          toast({
            title: "Removed from Wishlist",
            description: `${product.name} has been removed from your wishlist.`,
          });
        } else {
          toast({
            title: "Error",
            description: data.message || "Failed to remove item from wishlist",
            variant: "destructive",
          });
        }
      } else {
        // Add to wishlist
        const res = await fetch("http://localhost:5000/api/wishlist/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: product._id }),
        });

        const data = await res.json();
        if (res.ok) {
          setInWishlist(true);
          toast({
            title: "Added to Wishlist!",
            description: `${product.name} has been added to your wishlist.`,
          });
        } else {
          toast({
            title: "Error",
            description: data.message || "Failed to add item to wishlist",
            variant: "destructive",
          });
        }
      }
    } catch (err) {
      console.error("Error toggling wishlist:", err);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* ✅ Wishlist button with toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleWishlist}
          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
        >
          <Heart
            className={`h-4 w-4 ${inWishlist ? "text-red-600 fill-red-600" : "text-gray-600"}`}
          />
        </Button>

        <Badge className="absolute top-2 left-2 bg-orange-600">
          {product.category}
        </Badge>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg truncate">{product.name}</h3>
            <span className="text-lg font-bold text-orange-600">
              ${product.price}
            </span>
          </div>

          <p className="text-sm text-gray-600">by {product.artisan}</p>

          {product.rating && (
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600 ml-1">
                ({product.rating})
              </span>
            </div>
          )}

          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>

          <div className="pt-2 space-y-2">
            {/* ✅ Cart Button */}
            <Button
              onClick={handleAddToCart}
              className={`w-full ${
                inCart
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-orange-600 hover:bg-orange-700"
              }`}
              disabled={inCart}
            >
              {inCart ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>

            <Link to={`/product/${product._id}`}>
              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
