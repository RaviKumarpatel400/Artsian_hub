import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Oops! Page not found</h2>
        <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/">
          <Button className="bg-orange-600 hover:bg-orange-700">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
