import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Hapus data lama (optional)
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Seed Categories
  await prisma.category.createMany({
    data: [
      { name: 'Semua', slug: 'all' },
      { name: 'Espresso', slug: 'espresso' },
      { name: 'Manual Brew', slug: 'manual-brew' },
      { name: 'Non-Coffee', slug: 'non-coffee' },
      { name: 'Snack', slug: 'snack' },
    ]
  });

  // Seed Products
  await prisma.product.createMany({
    data: [
      { name: 'Espresso', description: 'Shot espresso murni dari biji kopi pilihan Nusantara', price: 18000, category: 'espresso', isPopular: true },
      { name: 'Americano', description: 'Espresso dengan air panas, rasa bold dan clean', price: 22000, category: 'espresso' },
      { name: 'Cappuccino', description: 'Espresso dengan steamed milk dan foam lembut', price: 28000, category: 'espresso', isPopular: true },
      { name: 'Caffe Latte', description: 'Espresso dengan susu steamed yang creamy', price: 28000, category: 'espresso' },
      { name: 'Kopi Susu Gula Aren', description: 'Signature drink dengan gula aren asli dan susu segar', price: 25000, category: 'espresso', isPopular: true, isNew: true },
      { name: 'Affogato', description: 'Espresso panas dituang di atas es krim vanilla', price: 32000, category: 'espresso' },
      { name: 'V60 Gayo', description: 'Single origin Aceh Gayo, notes: fruity, wine, chocolate', price: 30000, category: 'manual-brew', isPopular: true },
      { name: 'V60 Toraja', description: 'Single origin Sulawesi Toraja, notes: earthy, herbal, spicy', price: 32000, category: 'manual-brew' },
      { name: 'Cold Brew', description: 'Kopi dingin yang diseduh 18 jam, smooth dan refreshing', price: 28000, category: 'manual-brew', isNew: true },
      { name: 'Vietnam Drip', description: 'Kopi Vietnam style dengan condensed milk', price: 26000, category: 'manual-brew' },
      { name: 'Matcha Latte', description: 'Premium matcha Jepang dengan susu pilihan', price: 30000, category: 'non-coffee' },
      { name: 'Chocolate', description: 'Dark chocolate premium dengan susu', price: 28000, category: 'non-coffee' },
      { name: 'Teh Tarik', description: 'Teh susu ala Malaysia yang creamy', price: 22000, category: 'non-coffee' },
      { name: 'Wedang Jahe', description: 'Jahe hangat dengan gula merah, cocok untuk relax', price: 20000, category: 'non-coffee', isNew: true },
      { name: 'Croissant', description: 'Butter croissant yang renyah dan fluffy', price: 25000, category: 'snack' },
      { name: 'Banana Bread', description: 'Homemade banana bread dengan walnut', price: 22000, category: 'snack', isPopular: true },
      { name: 'Cookies', description: 'Chocolate chip cookies, crispy outside chewy inside', price: 18000, category: 'snack' },
      { name: 'Toast Butter Brown Sugar', description: 'Roti panggang dengan mentega dan gula merah', price: 20000, category: 'snack' },
    ]
  });

  console.log('✅ Seed berhasil!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());