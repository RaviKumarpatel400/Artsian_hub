import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';

interface Category {
  name: string;
  count: number;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/products/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link 
          to="/" 
          className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Marketplace
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Product Categories</h1>
        <p className="text-gray-600">
          Explore our handcrafted products organized by categories
        </p>
      </div>

      {/* Categories Grid */}
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={`/category/${encodeURIComponent(category.name)}`}
              className="group bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300"
            >
              <div className="text-center">
                <div className="bg-gradient-to-br from-primary/10 to-primary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:from-primary/20 group-hover:to-primary/30 transition-all">
                  <span className="text-2xl font-bold text-primary">
                    {category.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {category.count} {category.count === 1 ? 'product' : 'products'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Categories Available</h3>
          <p className="text-gray-600 mb-6">
            It looks like there are no product categories yet.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Link>
        </div>
      )}
    </div>
  );
};

export default Categories;
