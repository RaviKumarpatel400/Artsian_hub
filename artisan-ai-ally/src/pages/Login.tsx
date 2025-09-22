import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast({ title: "Missing Information", description: "Please fill all fields.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      toast({ title: "Welcome back!", description: "Logged in successfully." });
      navigate(from, { replace: true });
    } catch (error: any) {
      toast({ title: "Login Failed", description: error.message || "Invalid email or password.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to your ArtisanHub account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={isLoading}>
              {isLoading ? "Signing in..." : (<><LogIn className="h-4 w-4 mr-2" /> Sign In</>)}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-orange-600 hover:text-orange-700 font-medium">Sign up</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
