import { Button } from "@/components/ui/button";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  CreditCard,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext"; // ✅ Import useCart hook
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

type CartProduct = {
  product: {
    _id: string;
    name: string;
    image: string;
    price: number;
    artisan?: string;
  };
  quantity: number;
};

type SavedItem = {
  product: CartProduct["product"];
};

const Cart = () => {
  const { user, token } = useAuth();
  // ✅ Use CartContext instead of local state
  const { cartItems, updateQuantity, removeFromCart, clearCart, getTotalPrice, fetchCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // ✅ Debug logs
  console.log('🛒 Cart component rendered');
  console.log('📊 Cart items:', cartItems);
  console.log('📈 Cart length:', cartItems.length);

  // ------- Data fetchers -------
  const fetchSaved = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/saved", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSavedItems(data?.products || []);
    } catch (err) {
      console.error("Error fetching saved items:", err);
      setSavedItems([]);
    }
  };

  useEffect(() => {
    console.log('🔄 Cart useEffect triggered');
    // ✅ Fetch cart and saved items when component loads
    fetchCart();
    fetchSaved();
  }, [token]);

  // ------- Enhanced mutation functions using CartContext -------
  const handleUpdateQuantity = async (productId: string, type: "inc" | "dec") => {
    console.log('🔄 Updating quantity:', { productId, type });
    await updateQuantity(productId, type);
  };

  const handleRemoveFromCart = async (productId: string) => {
    console.log('🗑️ Removing from cart:', productId);
    await removeFromCart(productId);
    await fetchSaved(); // Refresh saved items too
  };

  const handleClearCart = async () => {
    console.log('🧹 Clearing entire cart');
    await clearCart();
  };

  const saveForLater = async (productId: string) => {
    try {
      console.log('💾 Saving for later:', productId);
      await fetch("http://localhost:5000/api/saved/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });
      await fetchCart();
      await fetchSaved();
    } catch (err) {
      console.error("Error saving for later:", err);
    }
  };

  const moveToCart = async (productId: string) => {
    try {
      console.log('🛒 Moving to cart:', productId);
      await fetch("http://localhost:5000/api/saved/move-to-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });
      await fetchCart();
      await fetchSaved();
    } catch (err) {
      console.error("Error moving to cart:", err);
    }
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const total = getTotalPrice();
      console.log('💳 Processing checkout with total:', total);
      
      const res = await fetch("http://localhost:5000/api/orders/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ totalAmount: total * 1.08 }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Checkout failed");

      toast({
        title: "Order placed!",
        description: "Your order has been successfully placed.",
      });

      await clearCart(); // Clear cart through context
      navigate("/orders");
    } catch (err) {
      console.error("Checkout error:", err);
      toast({
        title: "Error",
        description: "Something went wrong while placing your order.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // ✅ Enhanced empty state with debug info
  if (cartItems.length === 0 && savedItems.length === 0) {
    console.log('📭 Cart is empty, showing empty state');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h1>
          <p className="text-gray-600 mb-8">
            Start shopping to add items to your cart
          </p>
          <Link to="/">
            <Button className="bg-orange-600 hover:bg-orange-700">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Continue Shopping
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* -------- Cart Section -------- */}
          {cartItems.length > 0 ? (
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Shopping Cart ({cartItems.length} items)
                  </h1>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearCart}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Cart
                  </Button>
                </div>

                <div className="p-6 space-y-4">
                  {cartItems.map((item) => {
                    // ✅ Safety check for product data
                    if (!item.product) {
                      console.warn('⚠️ Item missing product data:', item);
                      return null;
                    }
                    
                    return (
                      <div
                        key={item.product._id}
                        className="flex items-center space-x-4 p-4 border rounded-lg"
                      >
                        <Link
                          to={`/product/${item.product._id}`}
                          className="flex items-center space-x-4 flex-1 hover:bg-gray-50 rounded-md p-2 transition"
                        >
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-20 h-20 object-cover rounded-md"
                            onError={(e) => {
                              console.warn('🖼️ Image failed to load:', item.product.image);
                              e.currentTarget.src = 'https://via.placeholder.com/80x80?text=No+Image';
                            }}
                          />
                          <div>
                            <h3 className="font-semibold text-lg text-orange-600 hover:underline">
                              {item.product.name}
                            </h3>
                            {item.product?.artisan && (
                              <p className="text-gray-600">by {item.product.artisan}</p>
                            )}
                            <p className="text-orange-600 font-bold">
                              ${item.product.price}
                            </p>
                          </div>
                        </Link>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleUpdateQuantity(item.product._id, "dec")}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="px-3 py-1 border rounded min-w-12 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleUpdateQuantity(item.product._id, "inc")}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Price + Remove + Save for Later */}
                        <div className="text-right space-y-2">
                          <p className="font-bold">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                          <div className="flex flex-col space-y-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFromCart(item.product._id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => saveForLater(item.product._id)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              Save Later
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6 text-center text-gray-600">
              <p>No products in your cart</p>
            </div>
          )}

          {/* -------- Order Summary -------- */}
          {cartItems.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm sticky top-8">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-bold text-gray-900">
                    Order Summary
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${(getTotalPrice() * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${(getTotalPrice() * 1.08).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="pt-4 space-y-3">
                    <Button
                      className="w-full bg-orange-600 hover:bg-orange-700"
                      onClick={handleCheckout}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        "Processing..."
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Proceed to Payment
                        </>
                      )}
                    </Button>
                    <Link to="/">
                      <Button variant="outline" className="w-full">
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>
                  {user && (
                    <div className="pt-4 text-sm text-gray-600">
                      <p>Shipping to: {user.name}</p>
                      <p>Email: {user.email}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* -------- Saved for Later Section -------- */}
        {savedItems.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm mt-8">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                Saved for Later ({savedItems.length} items)
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {savedItems.map((item) => (
                <div
                  key={item.product._id}
                  className="flex items-center space-x-4 p-4 border rounded-lg"
                >
                  <Link
                    to={`/product/${item.product._id}`}
                    className="flex items-center space-x-4 flex-1 hover:bg-gray-50 rounded-md p-2 transition"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div>
                      <h3 className="font-semibold text-lg text-orange-600 hover:underline">
                        {item.product.name}
                      </h3>
                      {item.product?.artisan && (
                        <p className="text-gray-600">by {item.product.artisan}</p>
                      )}
                      <p className="text-orange-600 font-bold">
                        ${item.product.price}
                      </p>
                    </div>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveToCart(item.product._id)}
                    className="text-green-600 hover:text-green-700"
                  >
                    Move to Cart
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
