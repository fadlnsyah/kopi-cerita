import { prisma } from '@/lib/prisma';

export const defaultSettings = [
  // Identity
  { key: 'store_name', value: 'Kopi Cerita', label: 'Nama Toko', group: 'identity', type: 'text' },
  { key: 'store_tagline', value: 'Setiap Kopi Punya Cerita', label: 'Tagline', group: 'identity', type: 'text' },
  { key: 'store_description', value: 'Kedai kopi dengan biji pilihan dari berbagai penjuru Nusantara', label: 'Deskripsi Singkat', group: 'identity', type: 'textarea' },
  
  // Contact
  { key: 'store_email', value: 'hello@kopicerita.com', label: 'Email', group: 'contact', type: 'email' },
  { key: 'store_phone', value: '+62 812 3456 7890', label: 'Telepon/WhatsApp', group: 'contact', type: 'phone' },
  { key: 'store_address', value: 'Jl. Kopi No. 123, Jakarta Selatan', label: 'Alamat', group: 'contact', type: 'textarea' },
  
  // Social Media
  { key: 'social_instagram', value: 'https://instagram.com/kopicerita', label: 'Instagram', group: 'social', type: 'url' },
  { key: 'social_facebook', value: 'https://facebook.com/kopicerita', label: 'Facebook', group: 'social', type: 'url' },
  { key: 'social_twitter', value: 'https://twitter.com/kopicerita', label: 'Twitter/X', group: 'social', type: 'url' },
  { key: 'social_tiktok', value: '', label: 'TikTok', group: 'social', type: 'url' },
  { key: 'social_youtube', value: '', label: 'YouTube', group: 'social', type: 'url' },
  
  // Footer
  { key: 'footer_copyright', value: '© 2026 Kopi Cerita. All rights reserved.', label: 'Copyright Text', group: 'footer', type: 'text' },
  { key: 'footer_note', value: 'Made with ☕ in Indonesia', label: 'Footer Note', group: 'footer', type: 'text' },
];

export async function getSiteSettings() {
  try {
    // Cek apakah settings sudah ada, jika belum buat default
    const existingCount = await prisma.siteSetting.count();
    
    if (existingCount === 0) {
      await prisma.siteSetting.createMany({
        data: defaultSettings,
      });
    }
    
    const settings = await prisma.siteSetting.findMany({
      orderBy: [{ group: 'asc' }, { key: 'asc' }],
    });
    
    // Transform ke object key-value sederhana
    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });
    
    return {
      list: settings,
      map: settingsMap
    };
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return { list: [], map: {} };
  }
}
