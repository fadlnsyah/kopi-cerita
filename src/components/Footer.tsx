import { 
  CoffeeBeanIcon, 
  LocationIcon, 
  PhoneIcon, 
  EmailIcon, 
  InstagramIcon, 
  FacebookIcon, 
  TwitterIcon, 
  YoutubeIcon, 
  TiktokIcon 
} from "./Icons";
import { getSiteSettings } from "@/lib/settings";
import Link from "next/link";

export default async function Footer() {
  const { map: settings } = await getSiteSettings();

  const socialLinks = [
    { key: 'social_instagram', icon: InstagramIcon, label: 'Instagram' },
    { key: 'social_facebook', icon: FacebookIcon, label: 'Facebook' },
    { key: 'social_twitter', icon: TwitterIcon, label: 'Twitter' },
    { key: 'social_tiktok', icon: TiktokIcon, label: 'TikTok' },
    { key: 'social_youtube', icon: YoutubeIcon, label: 'YouTube' },
  ];

  return (
    <footer className="bg-[#2B2118] text-[#E0D6C8] pt-16 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Identity */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-[#6F4E37] rounded-xl group-hover:bg-[#8B7355] transition-colors">
                <CoffeeBeanIcon className="w-8 h-8 text-[#FFFDF9]" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-heading text-[#FFFDF9]">
                  {settings.store_name || "Kopi Cerita"}
                </h3>
                <p className="text-xs text-[#8B7355] tracking-wide uppercase">
                  {settings.store_tagline || "Taste the Moment"}
                </p>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-[#A69080]">
              {settings.store_description || "Menyajikan kopi terbaik dari biji pilihan nusantara, diseduh dengan hati untuk menemani setiap ceritamu."}
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const url = settings[social.key];
                if (!url) return null;
                const Icon = social.icon;
                
                return (
                  <a 
                    key={social.key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-[#3C2F25] rounded-lg hover:bg-[#6F4E37] hover:text-white transition-all transform hover:-translate-y-1"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#FFFDF9] font-bold text-lg mb-6">Menu</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/menu" className="hover:text-[#6F4E37] transition-colors">Semua Menu</Link></li>
              <li><Link href="/menu?category=coffee" className="hover:text-[#6F4E37] transition-colors">Kopi</Link></li>
              <li><Link href="/menu?category=non-coffee" className="hover:text-[#6F4E37] transition-colors">Non-Kopi</Link></li>
              <li><Link href="/menu?category=snack" className="hover:text-[#6F4E37] transition-colors">Makanan Ringan</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[#FFFDF9] font-bold text-lg mb-6">Bantuan</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/orders" className="hover:text-[#6F4E37] transition-colors">Lacak Pesanan</Link></li>
              <li><Link href="/contact" className="hover:text-[#6F4E37] transition-colors">Hubungi Kami</Link></li>
              <li><Link href="/about" className="hover:text-[#6F4E37] transition-colors">Tentang Kami</Link></li>
              <li><Link href="/faq" className="hover:text-[#6F4E37] transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-[#FFFDF9] font-bold text-lg mb-6">Kontak</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <LocationIcon className="w-5 h-5 text-[#6F4E37] flex-shrink-0 mt-1" />
                <span className="text-sm leading-relaxed">
                  {settings.store_address || "Jl. Kopi No. 1, Jakarta"}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <PhoneIcon className="w-5 h-5 text-[#6F4E37]" />
                <a href={`tel:${settings.store_phone}`} className="text-sm hover:text-[#6F4E37]">
                  {settings.store_phone || "+62 812 3456 7890"}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <EmailIcon className="w-5 h-5 text-[#6F4E37]" />
                <a href={`mailto:${settings.store_email}`} className="text-sm hover:text-[#6F4E37]">
                  {settings.store_email || "hello@kopicerita.com"}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#3C2F25] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#8B7355]">
          <p>{settings.footer_copyright || "© 2024 Kopi Cerita. All rights reserved."}</p>
          <p>{settings.footer_note || "Made with ☕ in Indonesia"}</p>
        </div>
      </div>
    </footer>
  );
}
