import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"; 

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "craftsman"; // ✅ role
  shopName?: string; // optional, only for sellers
  gstin?: string;    // optional, only for sellers
}

interface AuthContextType {
  user: User | null;
  token: string | null; 
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string, 
    email: string, 
    password: string, 
    role: string, 
    sellerDetails?: { shopName: string; gstin: string } // ✅ optional for sellers
  ) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("artisan-user");
    const savedToken = localStorage.getItem("artisan-token");
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("artisan-user");
        localStorage.removeItem("artisan-token");
      }
    }
    setLoading(false);
  }, []);

  // ✅ Register new user or seller
  const register = async (
    name: string, 
    email: string, 
    password: string, 
    role: string, 
    sellerDetails?: { shopName: string; gstin: string }
  ): Promise<boolean> => {
    try {
      const body: any = { name, email, password, role };
      if (role === "craftsman" && sellerDetails) {
        body.shopName = sellerDetails.shopName;
        body.gstin = sellerDetails.gstin;
      }

      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      return true;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  // Login user (unchanged)
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("artisan-token", data.token);
      localStorage.setItem("artisan-user", JSON.stringify(data.user));

      setUser(data.user);
      setToken(data.token);

      return true;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("artisan-user");
    localStorage.removeItem("artisan-token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!user && !!token,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
