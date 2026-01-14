import { Metadata } from 'next';
import { PlantIcon, HeartSteamIcon, CommunityIcon, QualityIcon, CoffeeCupIcon } from '@/components/Icons';

export const metadata: Metadata = {
  title: 'Tentang Kami',
  description: 'Cerita di balik Kopi Cerita - kedai kopi dengan sentuhan tradisional Indonesia.',
};

/**
 * About Page - Kopi Cerita
 * 
 * Sections:
 * - Hero dengan tagline
 * - Cerita kami
 * - Values/filosofi dengan custom icons
 */

// Values dengan icon components
const values = [
  {
    Icon: PlantIcon,
    title: 'Berkelanjutan',
    description: 'Kami bermitra langsung dengan petani lokal, memastikan praktek pertanian yang ramah lingkungan dan harga yang adil.',
    bgColor: '#7A8450',
  },
  {
    Icon: HeartSteamIcon,
    title: 'Dibuat dengan Cinta',
    description: 'Setiap cangkir diseduh dengan penuh perhatian oleh barista berpengalaman yang passionate tentang kopi.',
    bgColor: '#6F4E37',
  },
  {
    Icon: CommunityIcon,
    title: 'Komunitas',
    description: 'Kopi Cerita adalah ruang untuk berkumpul, bercerita, dan membangun koneksi antar sesama.',
    bgColor: '#7A8450',
  },
  {
    Icon: QualityIcon,
    title: 'Kualitas',
    description: 'Dari biji hingga cangkir, kami tidak berkompromi dengan kualitas. Hanya yang terbaik dari Nusantara.',
    bgColor: '#6F4E37',
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F5EFE6' }}>
      {/* Hero Section */}
      <section 
        className="pt-32 pb-20 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #F5EFE6 0%, #EBE4D8 100%)' }}
      >
        <div 
          className="absolute top-20 right-10 w-64 h-64 rounded-full blur-3xl opacity-15"
          style={{ backgroundColor: '#7A8450' }}
        />
        
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <p 
              className="font-semibold tracking-widest uppercase text-sm mb-4 flex items-center justify-center gap-2"
              style={{ color: '#7A8450' }}
            >
              <span className="w-6 h-[2px]" style={{ backgroundColor: '#7A8450' }}></span>
              Tentang Kami
              <span className="w-6 h-[2px]" style={{ backgroundColor: '#7A8450' }}></span>
            </p>
            
            <h1 
              className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              style={{ color: '#2B2118' }}
            >
              Setiap Kopi Punya Cerita
            </h1>
            
            <p className="text-lg md:text-xl leading-relaxed" style={{ color: '#5C4A3D' }}>
              Kopi Cerita lahir dari kecintaan kami terhadap kopi Indonesia 
              dan keinginan untuk berbagi cerita di setiap seduhan.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20" style={{ backgroundColor: '#FFFDF9' }}>
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image Placeholder with Coffee Icon */}
            <div 
              className="aspect-[4/3] rounded-2xl flex items-center justify-center relative overflow-hidden"
              style={{ backgroundColor: '#EBE4D8' }}
            >
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-6 left-6">
                  <CoffeeCupIcon className="w-16 h-16" color="#6F4E37" />
                </div>
                <div className="absolute bottom-6 right-6">
                  <PlantIcon className="w-20 h-20" color="#7A8450" />
                </div>
              </div>
              <CoffeeCupIcon className="w-24 h-24" color="#6F4E37" />
            </div>
            
            {/* Content */}
            <div>
              <p 
                className="font-semibold tracking-widest uppercase text-sm mb-3"
                style={{ color: '#7A8450' }}
              >
                Cerita Kami
              </p>
              <h2 
                className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold mb-6"
                style={{ color: '#2B2118' }}
              >
                Berawal dari Secangkir Kopi
              </h2>
              
              <div className="space-y-4" style={{ color: '#5C4A3D' }}>
                <p>
                  Kopi Cerita dimulai pada tahun 2020, di tengah pandemi yang membuat 
                  banyak orang mencari kenyamanan dalam hal-hal sederhana. Kami percaya 
                  bahwa secangkir kopi yang baik bisa menjadi teman dalam setiap cerita.
                </p>
                <p>
                  Bermitra langsung dengan petani kopi di Aceh Gayo, Toraja, dan Papua, 
                  kami memastikan setiap biji kopi yang sampai ke tangan Anda 
                  adalah hasil dari kerja keras dan dedikasi para petani Indonesia.
                </p>
                <p>
                  Nama &quot;Kopi Cerita&quot; sendiri terinspirasi dari momen-momen indah 
                  yang tercipta saat kita menikmati kopi bersama — percakapan hangat, 
                  ide-ide baru, atau sekadar menikmati kesendirian yang damai.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section with Custom Icons */}
      <section 
        className="py-20"
        style={{ background: 'linear-gradient(180deg, #F5EFE6 0%, #EBE4D8 100%)' }}
      >
        <div className="container">
          <div className="text-center mb-16">
            <p 
              className="font-semibold tracking-widest uppercase text-sm mb-3"
              style={{ color: '#7A8450' }}
            >
              Nilai-Nilai Kami
            </p>
            <h2 
              className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold"
              style={{ color: '#2B2118' }}
            >
              Yang Kami Percaya
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.Icon;
              return (
                <div 
                  key={index}
                  className="p-6 rounded-2xl text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  style={{ backgroundColor: '#FFFDF9', border: '1px solid #E0D6C8' }}
                >
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: value.bgColor }}
                  >
                    <IconComponent className="w-7 h-7" color="#FFFDF9" />
                  </div>
                  <h3 
                    className="font-[family-name:var(--font-heading)] text-xl font-semibold mb-3"
                    style={{ color: '#2B2118' }}
                  >
                    {value.title}
                  </h3>
                  <p className="text-sm" style={{ color: '#5C4A3D' }}>
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ backgroundColor: '#FFFDF9' }}>
        <div className="container text-center">
          <h2 
            className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold mb-6"
            style={{ color: '#2B2118' }}
          >
            Mau Coba Kopi Kami?
          </h2>
          <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: '#5C4A3D' }}>
            Kunjungi kedai kami atau pesan online untuk merasakan kopi pilihan Nusantara.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/menu"
              className="px-8 py-4 font-semibold rounded-xl transition-all duration-300 hover:shadow-lg"
              style={{ backgroundColor: '#6F4E37', color: '#FFFDF9' }}
            >
              Lihat Menu
            </a>
            <a
              href="/contact"
              className="px-8 py-4 font-semibold rounded-xl border-2 transition-all duration-300"
              style={{ borderColor: '#6F4E37', color: '#6F4E37' }}
            >
              Hubungi Kami
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
