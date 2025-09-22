import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/ProductCard";
import { Search, ArrowRight, Star, Users, Award, Truck, Shield, Heart, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "@/context/ProductContext";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentBannerImage, setCurrentBannerImage] = useState(0);
  
  // const { products, loading, error } = useProducts();
  // const categories = ["All", "Pottery", "Textiles", "Woodwork", "Basketry", "Glasswork", "Jewelry", "Metalwork"];
  

   // ✅ Local product state (instead of useProducts())
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = ["All", "Pottery", "Textiles", "Woodwork", "Basketry", "Glasswork", "Jewelry", "Metalwork"];

  // ✅ Fetch products from backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Auto-changing banner images
  const bannerImages = [
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&q=80",
    "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1920&q=80", 
    "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1920&q=80",
    "https://rainforestbowls.com/cdn/shop/collections/kitchen-tools-accessories.jpg?v=1677009189",
    "https://www.artisan-marketplace.com/banner/2.jpg",
    "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=1920&q=80"

    
  
  ];

  // Auto-change banner images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerImage((prev) => (prev + 1) % bannerImages.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.artisan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading amazing handcrafted products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">Error: {error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Hero Section with Auto-changing Background Images */}
      <section className="relative h-screen overflow-hidden">
        {/* Auto-changing background images */}
        <div className="absolute inset-0">
          {bannerImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentBannerImage ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`Artisan crafts ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60"></div>
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="max-w-6xl mx-auto text-center text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in">
              Discover Authentic Handcrafted Treasures
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto text-gray-200 leading-relaxed">
              Connect with talented local artisans and discover unique, handmade pieces that tell a story. 
              Every purchase supports traditional craftsmanship and empowers creative communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/add-product">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-lg px-8 py-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-orange-500/25">
                  Start Selling <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-gray-900 text-lg px-8 py-4 rounded-full backdrop-blur-sm transition-all duration-300">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Banner Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {bannerImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBannerImage(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentBannerImage 
                  ? 'bg-orange-500 scale-125 shadow-lg' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group cursor-pointer">
              <Users className="h-12 w-12 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-orange-200">Happy Customers</div>
            </div>
            <div className="group cursor-pointer">
              <Award className="h-12 w-12 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-orange-200">Skilled Artisans</div>
            </div>
            <div className="group cursor-pointer">
              <Star className="h-12 w-12 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-4xl font-bold mb-2">4.9/5</div>
              <div className="text-orange-200">Customer Rating</div>
            </div>
            <div className="group cursor-pointer">
              <Heart className="h-12 w-12 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-4xl font-bold mb-2">2500+</div>
              <div className="text-orange-200">Products Sold</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide a seamless experience for both artisans and customers with premium features
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-200 transition-colors duration-300">
                <Truck className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Fast & Secure Shipping</h3>
              <p className="text-gray-600">Quick and secure delivery to your doorstep with real-time tracking and insurance coverage.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-200 transition-colors duration-300">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">100% Secure Payment</h3>
              <p className="text-gray-600">Your transactions are protected with enterprise-grade security and multiple payment options.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-200 transition-colors duration-300">
                <Award className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Quality Guaranteed</h3>
              <p className="text-gray-600">Every product is handpicked and quality-checked by our team of craft experts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Products Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Artisan Creations</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Each piece is lovingly crafted by skilled artisans who pour their heart, heritage, and expertise into every creation.
            </p>
          </div>

          {/* Enhanced Search and Filter */}
          <div className="flex flex-col md:flex-row gap-6 mb-12">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search products or artisans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-4 text-lg border-2 border-gray-200 focus:border-orange-500 rounded-2xl shadow-sm"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(category => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "secondary"}
                  className={`cursor-pointer px-6 py-3 text-sm font-medium rounded-full transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === category 
                      ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg' 
                      : 'bg-gray-100 hover:bg-orange-100 text-gray-700 hover:shadow-md'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Search className="h-16 w-16 text-orange-500" />
                </div>
                <p className="text-gray-500 text-xl mb-4">No products found matching your criteria.</p>
                <p className="text-gray-400 mb-8">Be the first to showcase your craft in this category!</p>
              </div>
              <Link to="/add-product">
                <Button className="bg-orange-600 hover:bg-orange-700 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Add the first product
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map(product => (
                <div key={product.id} className="transform hover:scale-105 transition-all duration-300">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Share Your Craft?</h2>
          <p className="text-xl md:text-2xl mb-10 text-orange-100 leading-relaxed max-w-3xl mx-auto">
            Are you a creator, maker, or artisan? Share your craft with the world and connect with customers who value authentic, handmade quality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/add-product">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl">
                Start Selling Today <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-orange-600 text-lg px-8 py-4 rounded-full transition-all duration-300">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* New Footer Section */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <h3 className="text-3xl font-bold mb-4 text-orange-400">ArtisanMarket</h3>
              <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                Connecting artisans with art lovers worldwide. We believe in preserving traditional craftsmanship 
                while providing a modern platform for creators to showcase their unique talents and stories.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-orange-600 transition-all duration-300 transform hover:scale-110">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-orange-600 transition-all duration-300 transform hover:scale-110">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-orange-600 transition-all duration-300 transform hover:scale-110">
                  <Instagram className="h-6 w-6" />
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-orange-300">Quick Links</h4>
              <ul className="space-y-4">
                <li><Link to="/" className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center"><ArrowRight className="h-4 w-4 mr-2" />Home</Link></li>
                <li><Link to="/about" className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center"><ArrowRight className="h-4 w-4 mr-2" />About Us</Link></li>
                <li><Link to="/add-product" className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center"><ArrowRight className="h-4 w-4 mr-2" />Sell Products</Link></li>
                <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center"><ArrowRight className="h-4 w-4 mr-2" />Contact</a></li>
                <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center"><ArrowRight className="h-4 w-4 mr-2" />FAQ</a></li>
              </ul>
            </div>
            
            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-orange-300">Get in Touch</h4>
              <div className="space-y-4">
                <div className="flex items-center group cursor-pointer">
                  <div className="bg-gray-800 p-2 rounded-full mr-4 group-hover:bg-orange-600 transition-colors duration-300">
                    <Mail className="h-5 w-5 text-orange-400 group-hover:text-white" />
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">hello@artisanmarket.com</span>
                </div>
                <div className="flex items-center group cursor-pointer">
                  <div className="bg-gray-800 p-2 rounded-full mr-4 group-hover:bg-orange-600 transition-colors duration-300">
                    <Phone className="h-5 w-5 text-orange-400 group-hover:text-white" />
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-start group cursor-pointer">
                  <div className="bg-gray-800 p-2 rounded-full mr-4 mt-1 group-hover:bg-orange-600 transition-colors duration-300">
                    <MapPin className="h-5 w-5 text-orange-400 group-hover:text-white" />
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
                    123 Craft Street<br />Artisan City, AC 12345
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Newsletter Subscription */}
          <div className="border-t border-gray-800 pt-8 mb-8">
            <div className="max-w-md mx-auto text-center">
              <h4 className="text-2xl font-semibold mb-4 text-orange-300">Stay Updated</h4>
              <p className="text-gray-300 mb-6 text-lg">Subscribe to our newsletter for the latest artisan creations and exclusive offers.</p>
              <div className="flex gap-3">
                <Input
                  placeholder="Enter your email"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 rounded-full px-6 py-3 focus:border-orange-500"
                />
                <Button className="bg-orange-600 hover:bg-orange-700 px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          
          
          {/* Copyright */}
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-lg">
              © 2024 ArtisanMarket. All rights reserved. Made with <Heart className="inline h-5 w-5 text-red-500 mx-1" /> for artisans worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;