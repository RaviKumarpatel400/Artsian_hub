import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProductProvider } from "@/context/ProductContext";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AddProduct from "./pages/AddProduct";
import ProductDetails from "./pages/ProductDetail";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navigation from "./components/Navigation";

// ✅ new imports
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import Categories from "./pages/Categories";
import CategoryPage from "./pages/CategoryPage"; // ✅ Add this import
import { WishlistProvider } from "./context/WishListContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <WishlistProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Navigation />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* ✅ Product details route */}
                <Route path="/product/:id" element={<ProductDetails />} />

                <Route path="/about" element={<About />} />
                
                {/* ✅ Add Categories routes */}
                <Route path="/categories" element={<Categories />} />
                <Route path="/category/:categoryName" element={<CategoryPage />} />

                {/* Protected Routes */}
                <Route
                  path="/add-product"
                  element={
                    <ProtectedRoute>
                      <AddProduct />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  }
                />

                {/* ✅ New Protected Routes */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/wishlist"
                  element={
                    <ProtectedRoute>
                      <Wishlist />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
          </WishlistProvider>   
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
