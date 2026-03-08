export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  description: string;
  images: string[];
  features: string[];
  status: 'Available' | 'Sold' | 'Reserved';
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface Inquiry {
  id: string;
  carId: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  status: 'New' | 'Read' | 'Replied' | 'Archived';
}

export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface SiteSettings {
  siteName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
  };
}
