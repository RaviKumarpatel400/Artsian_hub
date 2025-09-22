import { Product, mockProducts } from '@/data/products';

export class ProductService {
  private static STORAGE_KEY = 'artisan_products';

  // Initialize with mock data if no data exists
  static initializeData() {
    const existingData = localStorage.getItem(this.STORAGE_KEY);
    if (!existingData) {
      console.log('Initializing with mock data'); // Debug log
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(mockProducts));
    }
  }

  static async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    console.log('Adding product to service:', product); // Debug log
    
    this.initializeData();
    
    const products = this.getStoredProducts();
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      rating: 0
    };
    
    console.log('New product with ID:', newProduct); // Debug log
    
    products.unshift(newProduct); // Add to beginning
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
    
    console.log('Products after adding:', products.length); // Debug log
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return newProduct;
  }

  static async getProducts(): Promise<Product[]> {
    console.log('Getting products from service'); // Debug log
    
    this.initializeData();
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const products = this.getStoredProducts();
    console.log('Retrieved products count:', products.length); // Debug log
    
    return products;
  }

  static async getProductById(id: string): Promise<Product | null> {
    this.initializeData();
    
    const products = this.getStoredProducts();
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return products.find(p => p.id === id) || null;
  }

  private static getStoredProducts(): Product[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
}
