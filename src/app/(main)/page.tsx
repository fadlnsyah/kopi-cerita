'use client';

import FavoriteProducts from '@/components/FavoriteProducts';

/**
 * Landing Page - Kopi Cerita
 * 
 * Color Palette:
 * - Background: #F5EFE6 (Beige/Cream)
 * - Primary: #6F4E37 (Coffee Brown)
 * - Accent: #7A8450 (Olive)
 * - Text: #2B2118 (Dark Brown)
 */
export default function HomePage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F5EFE6' }}>
      {/* 
        =====================================================
        HERO SECTION
        =====================================================
      */}
      <section 
        className="relative min-h-[90vh] flex items-center overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #F5EFE6 0%, #EBE4D8 100%)' }}
      >
        {/* Decorative elements */}
        <div 
          className="absolute top-20 right-10 w-72 h-72 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: '#6F4E37' }}
        />
        <div 
          className="absolute bottom-20 left-10 w-80 h-80 rounded-full blur-3xl opacity-15"
          style={{ backgroundColor: '#7A8450' }}
        />
        
        {/* Content */}
        <div className="container relative z-10">
          <div className="max-w-2xl">
            {/* Tagline */}
            <p 
              className="font-semibold mb-4 tracking-widest uppercase text-sm flex items-center gap-3"
              style={{ color: '#7A8450' }}
            >
              <span className="w-8 h-[2px]" style={{ backgroundColor: '#7A8450' }}></span>
              Selamat Datang
            </p>
            
            {/* Heading */}
            <h1 
              className="font-[family-name:var(--font-heading)] text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              style={{ color: '#2B2118' }}
            >
              Kopi Cerita
            </h1>
            
            {/* Subheading */}
            <p 
              className="text-lg md:text-xl mb-10 leading-relaxed"
              style={{ color: '#5C4A3D' }}
            >
              Setiap kopi punya cerita. Temukan ceritamu di sini, dalam setiap 
              tegukan kopi pilihan dari berbagai penjuru Nusantara.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              {/* Primary Button */}
              <a
                href="/menu"
                className="inline-flex items-center px-8 py-4 font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                style={{ backgroundColor: '#6F4E37', color: '#FFFDF9' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5A3D2B'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6F4E37'}
              >
                <span>Lihat Menu</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              
              {/* Secondary Button */}
              <a
                href="/about"
                className="inline-flex items-center px-8 py-4 border-2 font-semibold rounded-xl transition-all duration-300 hover:shadow-md"
                style={{ borderColor: '#6F4E37', color: '#6F4E37', backgroundColor: 'transparent' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#6F4E37'; e.currentTarget.style.color = '#FFFDF9'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#6F4E37'; }}
              >
                Tentang Kami
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 
        =====================================================
        FAVORITE PRODUCTS SECTION
        =====================================================
      */}
      <FavoriteProducts />

      {/* 
        =====================================================
        FEATURES SECTION
        =====================================================
      */}
      <section 
        className="py-24"
        style={{ background: 'linear-gradient(180deg, #EBE4D8 0%, #F5EFE6 100%)' }}
      >
        <div className="container">
          <div className="text-center mb-16">
            <p 
              className="font-semibold tracking-widest uppercase text-sm mb-3 flex items-center justify-center gap-2"
              style={{ color: '#7A8450' }}
            >
              <span className="w-6 h-[2px]" style={{ backgroundColor: '#7A8450' }}></span>
              Kenapa Pilih Kami
              <span className="w-6 h-[2px]" style={{ backgroundColor: '#7A8450' }}></span>
            </p>
            <h2 
              className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold mb-4"
              style={{ color: '#2B2118' }}
            >
              Mengapa Kopi Cerita?
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#5C4A3D' }}>
              Kami percaya bahwa setiap cangkir kopi memiliki cerita. 
              Dari petani hingga barista, setiap langkah penuh makna.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 - Biji Kopi */}
            <div 
              className="group p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{ backgroundColor: '#FFFDF9', border: '1px solid #E0D6C8' }}
            >
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: '#6F4E37' }}
              >
                {/* Coffee Bean Icon */}
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                  <ellipse cx="12" cy="12" rx="6" ry="9" stroke="#FFFDF9" strokeWidth="1.5"/>
                  <path d="M12 3C12 3 9 7 9 12C9 17 12 21 12 21" stroke="#FFFDF9" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M8.5 6C10 7.5 10 9 9.5 11" stroke="#FFFDF9" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold mb-3" style={{ color: '#2B2118' }}>
                Biji Kopi Pilihan
              </h3>
              <p style={{ color: '#5C4A3D' }}>
                Dipilih langsung dari petani lokal terbaik di Indonesia. 
                Dari Gayo, Toraja, hingga Papua.
              </p>
            </div>

            {/* Card 2 - Dibuat dengan Cinta */}
            <div 
              className="group p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{ backgroundColor: '#FFFDF9', border: '1px solid #E0D6C8' }}
            >
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: '#7A8450' }}
              >
                {/* Coffee Cup with Steam Icon */}
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19V17C19 19.2091 17.2091 21 15 21H9C6.79086 21 5 19.2091 5 17V12Z" stroke="#FFFDF9" strokeWidth="1.5"/>
                  <path d="M19 14H20C21.1046 14 22 14.8954 22 16V16C22 17.1046 21.1046 18 20 18H19" stroke="#FFFDF9" strokeWidth="1.5"/>
                  <path d="M8 9C8 9 8.5 7 8 5" stroke="#FFFDF9" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M12 8C12 8 12.5 6 12 4" stroke="#FFFDF9" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M16 9C16 9 16.5 7 16 5" stroke="#FFFDF9" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold mb-3" style={{ color: '#2B2118' }}>
                Dibuat dengan Cinta
              </h3>
              <p style={{ color: '#5C4A3D' }}>
                Setiap cangkir diseduh dengan penuh perhatian oleh barista berpengalaman kami.
              </p>
            </div>

            {/* Card 3 - Berkelanjutan */}
            <div 
              className="group p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{ backgroundColor: '#FFFDF9', border: '1px solid #E0D6C8' }}
            >
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: '#6F4E37' }}
              >
                {/* Plant/Leaf Sustainability Icon */}
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22V12" stroke="#FFFDF9" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M12 12C12 12 7 10 7 6C7 2 12 2 12 2C12 2 17 2 17 6C17 10 12 12 12 12Z" stroke="#FFFDF9" strokeWidth="1.5"/>
                  <path d="M8 18C8 18 4 18 4 14C4 10 8 10 8 10" stroke="#FFFDF9" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M16 18C16 18 20 18 20 14C20 10 16 10 16 10" stroke="#FFFDF9" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold mb-3" style={{ color: '#2B2118' }}>
                Berkelanjutan
              </h3>
              <p style={{ color: '#5C4A3D' }}>
                Kami berkomitmen pada praktik ramah lingkungan dan mendukung kesejahteraan petani.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 
        =====================================================
        CTA SECTION
        =====================================================
      */}
      <section 
        className="py-24 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #F5EFE6 0%, #EBE4D8 50%, #D8CFC0 100%)' }}
      >
        <div 
          className="absolute top-10 right-10 w-48 h-48 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: '#7A8450' }}
        />
        
        <div className="container relative z-10 text-center">
          <p className="font-semibold tracking-widest uppercase text-sm mb-3" style={{ color: '#7A8450' }}>
            Mulai Sekarang
          </p>
          <h2 
            className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            style={{ color: '#2B2118' }}
          >
            Siap Memulai Ceritamu?
          </h2>
          <p className="text-lg mb-10 max-w-2xl mx-auto" style={{ color: '#5C4A3D' }}>
            Pesan sekarang dan nikmati kopi favoritmu. Tersedia pickup dan delivery.
          </p>
          
          <a
            href="/menu"
            className="inline-flex items-center px-10 py-5 font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 text-lg"
            style={{ backgroundColor: '#7A8450', color: '#FFFDF9' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5F6840'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7A8450'}
          >
            <span>Pesan Sekarang</span>
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>

      {/* 
        =====================================================
        FOOTER - Gradual transition, tidak langsung gelap
        =====================================================
      */}
      {/* 
        =====================================================
        GALLERY SECTION
        =====================================================
      */}
      <section 
        className="py-24"
        style={{ background: 'linear-gradient(180deg, #D8CFC0 0%, #A69080 100%)' }}
      >
        <div className="container">
          <div className="text-center mb-12">
            <h2 
              className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold mb-4"
              style={{ color: '#2B2118' }}
            >
              Galeri Kami
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#5C4A3D' }}>
              Intip suasana kedai dan momen-momen seru bersama pelanggan kami.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
            {/* Gallery Items - Using colored placeholders for now */}
            
            {/* Item 1 - Large */}
            <div className="col-span-2 row-span-2 relative group overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-[#6F4E37] opacity-80 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                <span className="text-white font-medium border border-white/50 px-4 py-2 rounded-full backdrop-blur-sm">Suasana Kedai</span>
              </div>
            </div>

            {/* Item 2 */}
            <div className="relative group overflow-hidden rounded-2xl">
               <div className="absolute inset-0 bg-[#A08E74] opacity-80 group-hover:scale-110 transition-transform duration-500"></div>
            </div>

            {/* Item 3 */}
             <div className="relative group overflow-hidden rounded-2xl">
               <div className="absolute inset-0 bg-[#8B7A5F] opacity-80 group-hover:scale-110 transition-transform duration-500"></div>
            </div>

            {/* Item 4 */}
             <div className="relative group overflow-hidden rounded-2xl">
               <div className="absolute inset-0 bg-[#7A6B4F] opacity-80 group-hover:scale-110 transition-transform duration-500"></div>
            </div>

            {/* Item 5 */}
             <div className="relative group overflow-hidden rounded-2xl">
               <div className="absolute inset-0 bg-[#5C4A3D] opacity-80 group-hover:scale-110 transition-transform duration-500"></div>
            </div>
          </div>
          
          <div className="text-center mt-12">
             <a
              href="https://instagram.com/kopicerita"
              target="_blank"
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 text-[#6F4E37] font-semibold hover:gap-4 transition-all"
            >
              <span>Lihat Lebih Banyak di Instagram</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
