import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Plus, Heart, Menu, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useWishlist } from "@/context/WishListContext";
import Categories from "./Categories"; // ✅ Import Categories component

const Navigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { getTotalItems } = useCart();
  const { toast } = useToast();
  const { wishlist, fetchWishlist } = useWishlist();

  const navLinks = [
    { href: "/", label: "Marketplace" },
    { href: "/about", label: "About" },
  ];

  const cartItemsCount = getTotalItems();
  const wishlistCount = wishlist?.length || 0;

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist?.();
    }
  }, [location, isAuthenticated, fetchWishlist]);

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <ShoppingBag className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-gray-900">ArtisanHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-gray-700 hover:text-primary transition-colors ${
                  location.pathname === link.href ? "text-primary font-medium" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
            {/* ✅ Add Categories Component */}
            <Categories />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Craftsman sees Add Product */}
                {user?.role === "craftsman" && (
                  <Link to="/add-product">
                    <Button size="sm" className="flex items-center space-x-2">
                      <Plus className="h-4 w-4" />
                      <span className="hidden sm:inline">Add Your Product</span>
                    </Button>
                  </Link>
                )}

                {/* User sees Cart */}
                {user?.role === "user" && (
                  <Link to="/cart" className="relative">
                    <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-primary transition-colors" />
                    {cartItemsCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs">
                        {cartItemsCount}
                      </Badge>
                    )}
                  </Link>
                )}

                {/* Wishlist */}
                <Link to="/wishlist" className="relative">
                  <Heart
                    className={`h-6 w-6 transition-colors ${
                      wishlistCount > 0 ? "text-red-500" : "text-gray-700 hover:text-primary"
                    }`}
                  />
                  {wishlistCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs bg-red-500">
                      {wishlistCount}
                    </Badge>
                  )}
                </Link>

                {/* Profile Dropdown */}
                <div className="relative group">
                  <Button variant="ghost" size="sm">
                    Hello, {user?.name}
                  </Button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="block py-2 text-gray-700 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {/* ✅ Mobile Categories */}
            <Link
              to="/categories"
              className="block py-2 text-gray-700 hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>

            {isAuthenticated ? (
              <>
                {user?.role === "user" && (
                  <Link
                    to="/cart"
                    className="block py-2 text-gray-700 hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Cart ({cartItemsCount})
                  </Link>
                )}

                {user?.role === "craftsman" && (
                  <Link
                    to="/add-product"
                    className="block py-2 text-gray-700 hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Add Your Product
                  </Link>
                )}

                <div className="py-2 text-gray-600 font-medium">
                  Hello, {user?.name}
                </div>
                <Link
                  to="/profile"
                  className="block py-2 pl-4 text-gray-700 hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Profile
                </Link>
                <Link
                  to="/orders"
                  className="block py-2 pl-4 text-gray-700 hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Orders
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 pl-4 text-gray-700 hover:text-primary transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2 text-gray-700 hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="block py-2 text-gray-700 hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
