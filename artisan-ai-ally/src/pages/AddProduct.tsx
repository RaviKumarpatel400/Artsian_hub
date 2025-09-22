import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Sparkles, Camera } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";  // ✅ added for role & token

const AddProduct = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    artisan: "",
    image: "",
    description: ""
  });

  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth(); // ✅ get user role

  // ✅ Redirect if not craftsman
  if (!isAuthenticated || user?.role !== "craftsman") {
    navigate("/");
    return null;
  }

  const categories = ["Pottery", "Textiles", "Woodwork", "Basketry", "Glasswork", "Jewelry", "Metalwork"];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, image: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const generateAIContent = async () => {
    if (!formData.name || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please provide at least the product name and category to generate AI content.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const descriptions = {
        "Pottery": `This exquisite ${formData.name.toLowerCase()} showcases the timeless beauty of traditional ceramic artistry.`,
        "Textiles": `Beautifully crafted ${formData.name.toLowerCase()} featuring intricate patterns and premium natural fibers.`,
        "Woodwork": `This stunning ${formData.name.toLowerCase()} is expertly carved from sustainably sourced wood.`,
        "Basketry": `Handwoven with traditional techniques passed down through generations.`,
        "Glasswork": `This elegant ${formData.name.toLowerCase()} is meticulously crafted using glassblowing techniques.`,
        "Jewelry": `This stunning ${formData.name.toLowerCase()} combines precious metals and stones.`,
        "Metalwork": `Forged with traditional metalworking techniques for strength and beauty.`
      };

      setFormData(prev => ({
        ...prev,
        description: descriptions[formData.category as keyof typeof descriptions] || "A beautiful handcrafted piece that showcases artisan skill."
      }));

      setIsGenerating(false);
      toast({
        title: "AI Content Generated!",
        description: "Your product description has been enhanced.",
      });
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.name || !formData.price || !formData.category || !formData.artisan) {
    toast({
      title: "Missing Information",
      description: "Please fill in all required fields.",
      variant: "destructive"
    });
    return;
  }

  const price = parseFloat(formData.price);
  if (isNaN(price) || price <= 0) {
    toast({
      title: "Invalid Price",
      description: "Please enter a valid price greater than 0.",
      variant: "destructive"
    });
    return;
  }

  setIsSubmitting(true);

  try {
    const token = localStorage.getItem("artisan-token");

    const res = await fetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: formData.name.trim(),
        price,
        category: formData.category,
        artisan: formData.artisan.trim(),
        image: formData.image || "https://via.placeholder.com/300",
        description: formData.description || `Beautiful handcrafted ${formData.name.toLowerCase()}.`,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to add product");
    }

    toast({
      title: "Product Added Successfully!",
      description: "Your item is now live in the marketplace.",
    });

    // Reset form
    setFormData({
      name: "",
      price: "",
      category: "",
      artisan: "",
      image: "",
      description: ""
    });

    navigate("/"); // go to marketplace

  } catch (error: any) {
    console.error("Error adding product:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to add product. Please try again.",
      variant: "destructive"
    });
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Share Your Craft with the World
          </h1>
          <p className="text-lg text-gray-600">
            Upload your handmade creation and let our AI assistant help you tell its story
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-6 w-6" />
              Add Your Product
            </CardTitle>
            <CardDescription>
              Fill in the details below and we'll help create compelling descriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image">Product Image</Label>
                {formData.image ? (
                  <div className="relative">
                    <img
                      src={formData.image}
                      alt="Product preview"
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setFormData(prev => ({ ...prev, image: "" }))}
                    >
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <span className="text-sm font-medium text-gray-900">Click to upload</span>
                      <span className="text-sm text-gray-500"> or drag and drop</span>
                    </Label>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG or JPEG</p>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (USD) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="artisan">Your Name *</Label>
                  <Input
                    id="artisan"
                    value={formData.artisan}
                    onChange={(e) => setFormData(prev => ({ ...prev, artisan: e.target.value }))}
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Product Description</Label>
                <div className="flex gap-2 mb-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateAIContent}
                    disabled={isGenerating || !formData.name || !formData.category}
                    className="flex items-center gap-2"
                  >
                    {isGenerating ? (
                      "Generating..."
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        AI Enhance
                      </>
                    )}
                  </Button>
                </div>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your handcrafted product..."
                  rows={6}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding to Marketplace..." : "Add to Marketplace"}
                </Button>
                <Button type="button" variant="outline" className="flex-1">
                  Save Draft
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddProduct;
