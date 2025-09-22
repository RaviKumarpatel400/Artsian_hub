import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    shopName: "",
    gstin: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRoleSelect = (role: "user" | "craftsman") => {
    setFormData(prev => ({ ...prev, role }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.role) {
      toast({
        title: "Select Account Type",
        description: "Please choose Personal User or Seller before continuing.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    if (formData.role === "craftsman" && (!formData.shopName || !formData.gstin)) {
      toast({
        title: "Missing Seller Details",
        description: "Please provide Shop/Brand Name and GSTIN No.",
        variant: "destructive"
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Pass seller details as well if role is craftsman
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.role,
        formData.role === "craftsman" ? { shopName: formData.shopName, gstin: formData.gstin } : undefined
      );

      toast({ title: "Account Created", description: "Your account has been registered successfully." });
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Join ArtisanHub</CardTitle>
          <CardDescription>Create your account to start exploring</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Role Selection */}
          <div className="flex justify-center gap-4 mb-6">
            <Button
              type="button"
              variant={formData.role === "user" ? "default" : "outline"}
              className={formData.role === "user" ? "bg-orange-600 hover:bg-orange-700 text-white" : ""}
              onClick={() => handleRoleSelect("user")}
            >
              Personal User
            </Button>
            <Button
              type="button"
              variant={formData.role === "craftsman" ? "default" : "outline"}
              className={formData.role === "craftsman" ? "bg-orange-600 hover:bg-orange-700 text-white" : ""}
              onClick={() => handleRoleSelect("craftsman")}
            >
              Seller
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>

            {/* Extra fields for Seller */}
            {formData.role === "craftsman" && (
              <>
                <div>
                  <Label htmlFor="shopName">Shop / Brand Name</Label>
                  <Input
                    id="shopName"
                    name="shopName"
                    type="text"
                    value={formData.shopName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="gstin">GSTIN No.</Label>
                  <Input
                    id="gstin"
                    name="gstin"
                    type="text"
                    value={formData.gstin}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            {/* Password */}
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
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={isLoading}>
              {isLoading ? "Creating Account..." : (<><UserPlus className="h-4 w-4 mr-2" /> Create Account</>)}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-600 hover:text-orange-700 font-medium">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
