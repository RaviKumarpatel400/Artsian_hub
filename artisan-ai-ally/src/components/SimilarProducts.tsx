import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishListContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  artisan: string;
}

interface SimilarProductsProps {
  productId: string;
  currentCategory?: string;
}

const SimilarProducts: React.FC<SimilarProductsProps> = ({ productId, currentCategory }) => {
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, isAuthenticated } = useAuth();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    if (productId) {
      fetchSimilarProducts();
    }
  }, [productId]);

  const fetchSimilarProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:5000/api/products/product/${productId}/similar`);
      if (!response.ok) {
        throw new Error('Failed to fetch similar products');
      }
      
      const data = await response.json();
      setSimilarProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching similar products:', err);
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item: any) => item._id === productId);
  };

  const handleWishlistToggle = async (product: Product) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to add items to your wishlist.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isInWishlist(product._id)) {
        await removeFromWishlist(product._id);
        toast({
          title: "Removed from Wishlist",
          description: `${product.name} has been removed from your wishlist.`,
        });
      } else {
        await addToWishlist(product._id);
        toast({
          title: "Added to Wishlist",
          description: `${product.name} has been added to your wishlist.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to add items to your cart.",
        variant: "destructive",
      });
      return;
    }

    if (user?.role !== 'user') {
      toast({
        title: "Not Available",
        description: "Only users can add items to cart.",
        variant: "destructive",
      });
      return;
    }

    try {
      await addToCart(product._id, 1);
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-300 rounded-lg h-48 mb-3"></div>
              <div className="bg-gray-300 h-4 rounded mb-2"></div>
              <div className="bg-gray-300 h-4 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Products</h2>
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">Failed to load similar products</p>
          <Button onClick={fetchSimilarProducts} variant="outline">
            Try Again
          </Button>
        </div>
      </section>
    );
  }

  if (similarProducts.length === 0) {
    return (
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Products</h2>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No similar products found in this category.</p>
          {currentCategory && (
            <Link 
              to={`/category/${encodeURIComponent(currentCategory)}`}
              className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
            >
              Browse {currentCategory} Products
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Similar Products</h2>
        {currentCategory && (
          <Link 
            to={`/category/${encodeURIComponent(currentCategory)}`}
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors text-sm"
          >
            View All {currentCategory}
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {similarProducts.map((product) => (
          <div key={product._id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
            <Link to={`/product/${product._id}`}>
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleWishlistToggle(product);
                  }}
                  className={`absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors ${
                    isInWishlist(product._id) ? 'text-red-500' : 'text-gray-400'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
                </button>
              </div>
            </Link>
            
            <div className="p-3">
              <Link to={`/product/${product._id}`}>
                <h3 className="text-sm font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-1 mb-1">
                  {product.name}
                </h3>
              </Link>
              
              <p className="text-xs text-gray-500 mb-2">By {product.artisan}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">${product.price}</span>
                {user?.role === 'user' && (
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(product)}
                    className="flex items-center space-x-1 text-xs px-2 py-1"
                  >
                    <ShoppingCart className="h-3 w-3" />
                    <span className="hidden sm:inline">Add</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SimilarProducts;
