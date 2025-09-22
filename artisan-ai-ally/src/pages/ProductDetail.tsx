import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, ArrowLeft, Check, Heart, CreditCard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import SimilarProducts from '@/components/SimilarProducts'; // ✅ Add this import

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [inCart, setInCart] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  const { isAuthenticated, token } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Check wishlist status
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!token || !product?._id) return;
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
  }, [token, product?._id]);

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (!product) return <p className="text-center py-10">Product not found</p>;

  // ✅ Add to cart
  const handleAddToCart = async () => {
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
    }
  };

  // ✅ Buy Now (direct checkout for this product)
  const handleBuyNow = async () => {
    if (!isAuthenticated || !token) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to place an order.",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/orders/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          products: [{ productId: product._id, quantity: 1 }],
          totalAmount: product.price * 1.08,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast({
          title: "Order placed!",
          description: "Your order has been successfully placed.",
        });
        navigate("/orders");
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to place order",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error in Buy Now:", err);
    }
  };

  // ✅ Toggle wishlist
  const handleToggleWishlist = async () => {
    if (!isAuthenticated || !token) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to manage wishlist.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (inWishlist) {
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
            description: `${product.name} has been removed.`,
          });
        }
      } else {
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
            title: "Added to Wishlist",
            description: `${product.name} has been added to your wishlist.`,
          });
        }
      }
    } catch (err) {
      console.error("Error toggling wishlist:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8"> {/* ✅ Changed max-width to accommodate similar products */}
      <Link to="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Marketplace
      </Link>

      <Card className="relative">
        {/* ✅ Heart icon on top-right corner */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleWishlist}
          className="absolute top-4 right-4 bg-white rounded-full shadow-md hover:bg-gray-100 z-10"
        >
          <Heart
            className={`h-6 w-6 ${inWishlist ? "text-red-600 fill-red-600" : "text-gray-600"}`}
          />
        </Button>

        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-80 object-cover rounded-lg"
          />

          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-gray-600 mb-4">by {product.artisan}</p>
            <p className="text-lg font-bold text-orange-600 mb-4">${product.price}</p>
            <p className="text-gray-700 mb-6">{product.description}</p>

            {/* Buttons Section */}
            <div className="flex flex-col space-y-3 mt-6">
              {/* Add to Cart */}
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

              {/* ✅ Buy Now */}
              <Button
                onClick={handleBuyNow}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Buy Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ✅ Similar Products Component - Add this at the bottom */}
      {product && (
        <SimilarProducts 
          productId={product._id} 
          currentCategory={product.category}
        />
      )}
    </div>
  );
};

export default ProductDetails;
