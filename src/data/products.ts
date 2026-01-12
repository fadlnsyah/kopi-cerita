/**
 * Product Types & Mock Data
 * 
 * Nanti akan diganti dengan data dari database
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'espresso' | 'manual-brew' | 'non-coffee' | 'snack';
  image?: string;
  isPopular?: boolean;
  isNew?: boolean;
}

export const categories = [
  { id: 'all', label: 'Semua', icon: '☕' },
  { id: 'espresso', label: 'Espresso Based', icon: '☕' },
  { id: 'manual-brew', label: 'Manual Brew', icon: '🫖' },
  { id: 'non-coffee', label: 'Non-Coffee', icon: '🍵' },
  { id: 'snack', label: 'Snack', icon: '🍰' },
];

export const products: Product[] = [
  // Espresso Based
  {
    id: '1',
    name: 'Espresso',
    description: 'Shot espresso murni dari biji kopi pilihan Nusantara',
    price: 18000,
    category: 'espresso',
    isPopular: true,
  },
  {
    id: '2',
    name: 'Americano',
    description: 'Espresso dengan air panas, rasa bold dan clean',
    price: 22000,
    category: 'espresso',
  },
  {
    id: '3',
    name: 'Cappuccino',
    description: 'Espresso dengan steamed milk dan foam lembut',
    price: 28000,
    category: 'espresso',
    isPopular: true,
  },
  {
    id: '4',
    name: 'Caffe Latte',
    description: 'Espresso dengan susu steamed yang creamy',
    price: 28000,
    category: 'espresso',
  },
  {
    id: '5',
    name: 'Kopi Susu Gula Aren',
    description: 'Signature drink dengan gula aren asli dan susu segar',
    price: 25000,
    category: 'espresso',
    isPopular: true,
    isNew: true,
  },
  {
    id: '6',
    name: 'Affogato',
    description: 'Espresso panas dituang di atas es krim vanilla',
    price: 32000,
    category: 'espresso',
  },

  // Manual Brew
  {
    id: '7',
    name: 'V60 Gayo',
    description: 'Single origin Aceh Gayo, notes: fruity, wine, chocolate',
    price: 30000,
    category: 'manual-brew',
    isPopular: true,
  },
  {
    id: '8',
    name: 'V60 Toraja',
    description: 'Single origin Sulawesi Toraja, notes: earthy, herbal, spicy',
    price: 32000,
    category: 'manual-brew',
  },
  {
    id: '9',
    name: 'Cold Brew',
    description: 'Kopi dingin yang diseduh 18 jam, smooth dan refreshing',
    price: 28000,
    category: 'manual-brew',
    isNew: true,
  },
  {
    id: '10',
    name: 'Vietnam Drip',
    description: 'Kopi Vietnam style dengan condensed milk',
    price: 26000,
    category: 'manual-brew',
  },

  // Non-Coffee
  {
    id: '11',
    name: 'Matcha Latte',
    description: 'Premium matcha Jepang dengan susu pilihan',
    price: 30000,
    category: 'non-coffee',
  },
  {
    id: '12',
    name: 'Chocolate',
    description: 'Dark chocolate premium dengan susu',
    price: 28000,
    category: 'non-coffee',
  },
  {
    id: '13',
    name: 'Teh Tarik',
    description: 'Teh susu ala Malaysia yang creamy',
    price: 22000,
    category: 'non-coffee',
  },
  {
    id: '14',
    name: 'Wedang Jahe',
    description: 'Jahe hangat dengan gula merah, cocok untuk relax',
    price: 20000,
    category: 'non-coffee',
    isNew: true,
  },

  // Snacks
  {
    id: '15',
    name: 'Croissant',
    description: 'Butter croissant yang renyah dan fluffy',
    price: 25000,
    category: 'snack',
  },
  {
    id: '16',
    name: 'Banana Bread',
    description: 'Homemade banana bread dengan walnut',
    price: 22000,
    category: 'snack',
    isPopular: true,
  },
  {
    id: '17',
    name: 'Cookies',
    description: 'Chocolate chip cookies, crispy outside chewy inside',
    price: 18000,
    category: 'snack',
  },
  {
    id: '18',
    name: 'Toast Butter Brown Sugar',
    description: 'Roti panggang dengan mentega dan gula merah',
    price: 20000,
    category: 'snack',
  },
];

// Helper function untuk format harga
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}
