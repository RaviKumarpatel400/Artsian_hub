import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Category {
  name: string;
  count: number;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Desktop Categories Dropdown */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="hidden md:flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-primary transition-colors"
      >
        <span>Categories</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="py-2">
            {loading ? (
              <div className="px-4 py-2 text-gray-500">Loading categories...</div>
            ) : categories.length > 0 ? (
              <>
                {/* All Categories Link */}
                <Link
                  to="/categories"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  All Categories
                </Link>
                
                {/* Individual Category Links */}
                {categories.map((category, index) => (
                  <Link
                    key={index}
                    to={`/category/${encodeURIComponent(category.name)}`}
                    className="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <span>{category.name}</span>
                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </Link>
                ))}
              </>
            ) : (
              <div className="px-4 py-2 text-gray-500">No categories available</div>
            )}
          </div>
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default Categories;
