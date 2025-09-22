export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  artisan: string;
  rating: number;
  description: string;
  story: string;
  socialCaption: string;
  hashtags: string[];
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Handwoven Ceramic Bowl",
    price: 45,
    category: "Pottery",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500",
    artisan: "Maria Santos",
    rating: 4.8,
    description: "Beautiful handcrafted ceramic bowl with traditional glazing techniques passed down through generations.",
    story: "Maria learned pottery from her grandmother in the mountains of Peru. Each piece tells a story of tradition and craftsmanship spanning three generations.",
    socialCaption: "✨ Handcrafted with love! This stunning ceramic bowl brings centuries of tradition to your table. Each piece is unique, just like the stories behind them. #HandmadeTradition",
    hashtags: ["#handmade", "#pottery", "#ceramics", "#artisan", "#sustainable", "#traditional", "#unique", "#homedecor"]
  },
  {
    id: "2",
    name: "Macrame Wall Hanging",
    price: 32,
    category: "Textiles",
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=500",
    artisan: "Elena Rodriguez",
    rating: 4.9,
    description: "Intricate macrame wall hanging featuring natural cotton cord and bohemian design patterns.",
    story: "Elena discovered macrame during her travels through Morocco and brings Mediterranean influences to her contemporary designs.",
    socialCaption: "🌿 Transform your space with this beautiful macrame wall hanging! Handknotted with natural cotton for that perfect boho vibe. #BohoDecor",
    hashtags: ["#macrame", "#wallart", "#boho", "#handknotted", "#naturalfibers", "#interiordesign", "#sustainable", "#artisan"]
  },
  {
    id: "3",
    name: "Carved Wooden Spoon Set",
    price: 28,
    category: "Woodwork",
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500",
    artisan: "Thomas Berg",
    rating: 4.7,
    description: "Set of three hand-carved wooden spoons made from sustainably sourced maple wood.",
    story: "Thomas learned woodcarving from his father in the forests of Norway. Each spoon is carved with tools passed down through his family for generations.",
    socialCaption: "🌲 Sustainable kitchen essentials! These hand-carved wooden spoons bring warmth and tradition to your cooking. Made with love from Norwegian maple. #SustainableLiving",
    hashtags: ["#woodworking", "#sustainable", "#kitchen", "#handcarved", "#maple", "#traditional", "#ecofriendly", "#artisan"]
  },
  {
    id: "4",
    name: "Woven Basket Collection",
    price: 55,
    category: "Basketry",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
    artisan: "Amara Okafor",
    rating: 4.9,
    description: "Set of three nested baskets woven from natural palm fronds using traditional African techniques.",
    story: "Amara continues the basketweaving traditions of her Yoruba heritage, creating functional art that connects modern homes to ancient wisdom.",
    socialCaption: "🌴 Beautiful handwoven baskets that bring African tradition into your home! Perfect for storage and display. Each piece tells a story of heritage and craft. #AfricanArt",
    hashtags: ["#basketweaving", "#african", "#traditional", "#palmfronds", "#heritage", "#functional", "#storage", "#artisan"]
  },
  {
    id: "5",
    name: "Hand-Blown Glass Vase",
    price: 78,
    category: "Glasswork",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
    artisan: "Giuseppe Rossi",
    rating: 4.8,
    description: "Elegant hand-blown glass vase with swirling color patterns inspired by Venetian glassmaking traditions.",
    story: "Giuseppe trained in the glass studios of Murano, Italy, where he mastered the ancient art of Venetian glassblowing before bringing his skills to create contemporary pieces.",
    socialCaption: "✨ Venetian elegance for your home! This hand-blown glass vase captures light and color in the most beautiful way. True artisan craftsmanship from Murano traditions. #VenetianGlass",
    hashtags: ["#glassblowing", "#venetian", "#murano", "#handblown", "#elegant", "#homedecor", "#artisan", "#italian"]
  },
  {
    id: "6",
    name: "Embroidered Throw Pillow",
    price: 38,
    category: "Textiles",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
    artisan: "Fatima Al-Zahra",
    rating: 4.6,
    description: "Beautifully embroidered throw pillow featuring traditional Middle Eastern patterns in gold thread.",
    story: "Fatima learned the art of gold thread embroidery from the master craftswomen of Damascus, preserving techniques that date back centuries.",
    socialCaption: "🌟 Add luxury to your space with this exquisite gold-embroidered pillow! Traditional Middle Eastern craftsmanship meets modern comfort. #LuxuryTextiles",
    hashtags: ["#embroidery", "#goldthread", "#middleeastern", "#traditional", "#luxury", "#homedecor", "#damascus", "#artisan"]
  }
];
