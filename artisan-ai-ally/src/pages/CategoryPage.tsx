import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart } from 'lucide-react';
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

const CategoryPage = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user, isAuthenticated } = useAuth();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    if (categoryName) {
      fetchCategoryProducts();
    }
  }, [categoryName]);

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:5000/api/products?category=${encodeURIComponent(categoryName!)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading {categoryName} products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">Error: {error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <nav className="flex items-center text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/categories" className="hover:text-primary transition-colors">Categories</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{categoryName}</span>
        </nav>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {categoryName}
            </h1>
            <p className="text-gray-600">
              {products.length} {products.length === 1 ? 'product' : 'products'} found
            </p>
          </div>
          
          <Link 
            to="/categories" 
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            All Categories
          </Link>
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <Link to={`/product/${product._id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                />
              </Link>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <Link to={`/product/${product._id}`}>
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  <button
                    onClick={() => handleWishlistToggle(product)}
                    className={`ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors ${
                      isInWishlist(product._id) ? 'text-red-500' : 'text-gray-400'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
                
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                <p className="text-sm text-gray-500 mb-3">By {product.artisan}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-primary">${product.price}</span>
                  {user?.role === 'user' && (
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                      className="flex items-center space-x-1"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Add to Cart</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No products found in "{categoryName}"
          </h3>
          <p className="text-gray-600 mb-6">
            Be the first to showcase your craft in this category!
          </p>
          {user?.role === 'craftsman' && (
            <Link to="/add-product">
              <Button>Add Your First Product</Button>
            </Link>
          )}
        </div>
      )}

      {/* Suggestion to Browse Other Categories */}
      {products.length > 0 && (
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Looking for something else?</p>
          <Link 
            to="/categories"
            className="inline-flex items-center px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
          >
            Browse All Categories
          </Link>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
