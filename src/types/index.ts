export type Book = {
  id: string;
  title: string;
  author: string;
  cover: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  badge?: 'new' | 'hit' | 'exclusive' | 'preorder';
  coverType: 'hard' | 'soft';
  rating: number;
  reviewCount: number;
  category?: string;
};

export type Category = {
  id: string;
  name: string;
  icon?: string;
  subcategories?: Category[];
};

export type Banner = {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  link: string;
};

export type PromoCard = {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  link: string;
  bgColor: string;
};

export type CartItem = Book & {
  quantity: number;
};

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
};

export type Store = {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  coordinates: {
    lat: number;
    lng: number;
  };
};

export type Promotion = {
  id: string;
  title: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  discount: number;
};
