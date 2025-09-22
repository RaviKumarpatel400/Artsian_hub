import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, Users, Globe, Sparkles, TrendingUp, Award, ArrowRight, 
  Shield, Clock, Star, CheckCircle, Target, Lightbulb, 
  Handshake, Zap, Map, Camera, MessageCircle, Truck,
  Play, Quote, ArrowDown, ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const About = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [animatedStats, setAnimatedStats] = useState(false);

  const stats = [
    { label: "Active Artisans", value: "2,847", icon: Users, color: "text-blue-600" },
    { label: "Products Sold", value: "12,389", icon: TrendingUp, color: "text-green-600" },
    { label: "Countries Reached", value: "45", icon: Globe, color: "text-purple-600" },
    { label: "Success Stories", value: "156", icon: Award, color: "text-orange-600" },
  ];

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Storytelling",
      description: "Our AI assistant helps artisans create compelling product descriptions, stories, and social media content that capture the essence of their craft.",
      benefits: ["Auto-generated product descriptions", "Cultural story preservation", "Multi-language support"]
    },
    {
      icon: Globe,
      title: "Global Marketplace",
      description: "Connect local artisans with customers worldwide, breaking down geographical barriers and expanding market reach.",
      benefits: ["International shipping", "Multi-currency support", "Local market insights"]
    },
    {
      icon: Heart,
      title: "Supporting Communities",
      description: "Every purchase directly supports artisan communities, preserving traditional crafts and creating sustainable livelihoods.",
      benefits: ["Fair trade practices", "Community development", "Skill preservation programs"]
    },
    {
      icon: Users,
      title: "Building Connections",
      description: "Foster meaningful relationships between makers and customers through authentic storytelling and cultural exchange.",
      benefits: ["Direct artisan contact", "Custom order system", "Cultural workshops"]
    }
  ];

  const additionalFeatures = [
    { icon: Shield, title: "Secure Transactions", desc: "Bank-level security for all payments" },
    { icon: Clock, title: "24/7 Support", desc: "Round-the-clock customer assistance" },
    { icon: Star, title: "Quality Assurance", desc: "Every product verified by experts" },
    { icon: Truck, title: "Global Shipping", desc: "Worldwide delivery network" },
    { icon: Camera, title: "Professional Photos", desc: "Free product photography service" },
    { icon: MessageCircle, title: "Marketing Tools", desc: "Built-in social media integration" }
  ];

  const milestones = [
    { year: "2020", title: "Platform Launch", desc: "Started with 10 artisans from 3 countries" },
    { year: "2021", title: "Global Expansion", desc: "Reached 500 artisans across 15 countries" },
    { year: "2022", title: "AI Integration", desc: "Launched AI storytelling and marketing tools" },
    { year: "2023", title: "Community Impact", desc: "Supported 1000+ artisan families worldwide" },
    { year: "2024", title: "Future Growth", desc: "Expanding to emerging markets and new crafts" }
  ];

  const values = [
    {
      icon: Target,
      title: "Authenticity",
      description: "We celebrate genuine craftsmanship and cultural heritage, ensuring every piece tells a real story."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Combining traditional artistry with cutting-edge technology to create new possibilities."
    },
    {
      icon: Handshake,
      title: "Fair Partnership",
      description: "Building equitable relationships that benefit artisans, customers, and communities alike."
    },
    {
      icon: Zap,
      title: "Empowerment",
      description: "Providing tools and opportunities that help artisans build sustainable, thriving businesses."
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedStats(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Hero Section with Video Background Effect */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-red-600 to-pink-600"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-orange-300/20 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-300/30 rounded-full animate-pulse"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center text-white">
          <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg px-6 py-2">
            About ArtisanHub
          </Badge>
          <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
            Empowering Artisans Through
            <span className="block text-orange-300">Technology</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-4xl mx-auto text-orange-100 leading-relaxed">
            We bridge the gap between traditional craftsmanship and modern commerce, using AI to help artisans tell their stories and reach customers who value authenticity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
              <Play className="mr-2 h-5 w-5" />
              Watch Our Story
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 text-lg px-8 py-4 rounded-full transition-all duration-300">
              Scroll to Learn More
              <ArrowDown className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Impact in Numbers</h2>
            <p className="text-xl text-gray-600">Making a difference in artisan communities worldwide</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white w-20 h-20 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                  <stat.icon className={`h-10 w-10 ${stat.color}`} />
                </div>
                <div className={`text-4xl font-bold text-gray-900 mb-2 transition-all duration-1000 ${animatedStats ? 'opacity-100' : 'opacity-0'}`}>
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Mission & Values Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                In a world increasingly dominated by mass production, we believe in the power of human creativity and traditional craftsmanship. Our mission is to preserve cultural heritage while empowering artisans with modern tools that help them thrive in the digital economy.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Preserve Cultural Heritage</h4>
                    <p className="text-gray-600">Documenting and sharing traditional craft techniques for future generations.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Economic Empowerment</h4>
                    <p className="text-gray-600">Creating sustainable income opportunities for artisan communities.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Global Connection</h4>
                    <p className="text-gray-600">Bridging cultural gaps through authentic storytelling and craftsmanship.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
                  <CardContent className="p-6 text-center">
                    <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-8 w-8 text-orange-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{value.title}</h4>
                    <p className="text-sm text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600">From humble beginnings to global impact</p>
          </div>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-orange-200"></div>
            
            {milestones.map((milestone, index) => (
              <div key={index} className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="text-2xl font-bold text-orange-600 mb-2">{milestone.year}</div>
                      <h4 className="font-semibold text-gray-900 mb-2">{milestone.title}</h4>
                      <p className="text-gray-600">{milestone.desc}</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-orange-600 rounded-full border-4 border-white shadow-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How We Make a Difference</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Technology meets tradition in our comprehensive platform designed specifically for artisans and craft enthusiasts.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-4">
                    <div className="bg-orange-100 p-3 rounded-xl group-hover:bg-orange-200 transition-colors duration-300">
                      <feature.icon className="h-8 w-8 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{feature.title}</h3>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <ChevronRight className="h-4 w-4 text-orange-600" />
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gray-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-100 transition-all duration-300 transform group-hover:scale-110">
                  <feature.icon className="h-8 w-8 text-gray-600 group-hover:text-orange-600 transition-colors duration-300" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">{feature.title}</h4>
                <p className="text-xs text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">
              Real artisans, real impact. See how our platform has transformed creative businesses around the world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Quote className="h-8 w-8 text-orange-200" />
              </div>
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  "The AI storytelling helped me share the history behind my ceramic pieces. My sales increased by 300% in just three months!"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
                    <span className="font-bold text-orange-800">MS</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Maria Santos</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Map className="h-4 w-4" />
                      Ceramic Artist, Peru
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Quote className="h-8 w-8 text-orange-200" />
              </div>
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  "I went from selling locally to reaching customers in 15 countries. The platform's social media tools made all the difference."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                    <span className="font-bold text-blue-800">ER</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Elena Rodriguez</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Map className="h-4 w-4" />
                      Textile Artist, Spain
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Quote className="h-8 w-8 text-orange-200" />
              </div>
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  "The platform helped me preserve my grandmother's weaving techniques while building a sustainable business for my family."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                    <span className="font-bold text-green-800">AO</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Amara Okafor</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Map className="h-4 w-4" />
                      Basket Weaver, Nigeria
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Join Our Community</h2>
          <p className="text-xl md:text-2xl mb-10 text-orange-100 leading-relaxed">
            Join thousands of artisans who are already using our platform to grow their businesses and preserve their traditions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/add-product">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl">
                Start Your Journey <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 text-lg px-8 py-4 rounded-full transition-all duration-300">
              Contact Us
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold">Free</div>
              <div className="text-orange-200 text-sm">Setup & Training</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-orange-200 text-sm">Support Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">0%</div>
              <div className="text-orange-200 text-sm">Commission First Month</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;