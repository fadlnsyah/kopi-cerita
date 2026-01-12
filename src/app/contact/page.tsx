'use client';

import { useState } from 'react';
import { LocationIcon, PhoneIcon, EmailIcon, ClockIcon } from '@/components/Icons';

/**
 * Contact Page - Kopi Cerita
 * 
 * Sections:
 * - Hero
 * - Contact Form
 * - Location & Info dengan custom icons
 */

// Contact info dengan icon components
const contactInfo = [
  {
    Icon: LocationIcon,
    title: 'Alamat',
    content: 'Jl. Kopi Nikmat No. 123\nJakarta Selatan, 12345',
    bgColor: '#6F4E37',
  },
  {
    Icon: PhoneIcon,
    title: 'Telepon',
    content: '+62 812 3456 7890',
    bgColor: '#7A8450',
  },
  {
    Icon: EmailIcon,
    title: 'Email',
    content: 'halo@kopicerita.id',
    bgColor: '#6F4E37',
  },
  {
    Icon: ClockIcon,
    title: 'Jam Operasional',
    content: 'Senin - Jumat: 07:00 - 22:00\nSabtu - Minggu: 08:00 - 23:00',
    bgColor: '#7A8450',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulasi submit (nanti connect ke backend)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    
    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F5EFE6' }}>
      {/* Hero Section */}
      <section 
        className="pt-32 pb-16 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #F5EFE6 0%, #EBE4D8 100%)' }}
      >
        <div 
          className="absolute top-20 left-10 w-48 h-48 rounded-full blur-3xl opacity-15"
          style={{ backgroundColor: '#6F4E37' }}
        />
        
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <p 
              className="font-semibold tracking-widest uppercase text-sm mb-4 flex items-center justify-center gap-2"
              style={{ color: '#7A8450' }}
            >
              <span className="w-6 h-[2px]" style={{ backgroundColor: '#7A8450' }}></span>
              Hubungi Kami
              <span className="w-6 h-[2px]" style={{ backgroundColor: '#7A8450' }}></span>
            </p>
            
            <h1 
              className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold mb-6"
              style={{ color: '#2B2118' }}
            >
              Ada Pertanyaan?
            </h1>
            
            <p className="text-lg" style={{ color: '#5C4A3D' }}>
              Kami senang mendengar dari Anda. Kirim pesan atau kunjungi kedai kami langsung.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div 
              className="p-8 rounded-2xl"
              style={{ backgroundColor: '#FFFDF9', border: '1px solid #E0D6C8' }}
            >
              <h2 
                className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-6"
                style={{ color: '#2B2118' }}
              >
                Kirim Pesan
              </h2>
              
              {isSubmitted ? (
                <div 
                  className="p-6 rounded-xl text-center"
                  style={{ backgroundColor: 'rgba(122, 132, 80, 0.1)' }}
                >
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{ backgroundColor: '#7A8450' }}
                  >
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12L10 17L19 7" stroke="#FFFDF9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="font-semibold" style={{ color: '#7A8450' }}>
                    Pesan terkirim!
                  </p>
                  <p className="text-sm mt-2" style={{ color: '#5C4A3D' }}>
                    Kami akan segera menghubungi Anda.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label 
                      htmlFor="name" 
                      className="block text-sm font-medium mb-2"
                      style={{ color: '#2B2118' }}
                    >
                      Nama
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-300 focus:shadow-md"
                      style={{ 
                        borderColor: '#E0D6C8', 
                        backgroundColor: '#FFFDF9',
                        color: '#2B2118',
                      }}
                      placeholder="Nama Anda"
                    />
                  </div>
                  
                  <div>
                    <label 
                      htmlFor="email"
                      className="block text-sm font-medium mb-2"
                      style={{ color: '#2B2118' }}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-300 focus:shadow-md"
                      style={{ 
                        borderColor: '#E0D6C8', 
                        backgroundColor: '#FFFDF9',
                        color: '#2B2118',
                      }}
                      placeholder="email@example.com"
                    />
                  </div>
                  
                  <div>
                    <label 
                      htmlFor="subject"
                      className="block text-sm font-medium mb-2"
                      style={{ color: '#2B2118' }}
                    >
                      Subjek
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-300 focus:shadow-md"
                      style={{ 
                        borderColor: '#E0D6C8', 
                        backgroundColor: '#FFFDF9',
                        color: '#2B2118',
                      }}
                    >
                      <option value="">Pilih subjek...</option>
                      <option value="order">Pertanyaan Pesanan</option>
                      <option value="feedback">Feedback</option>
                      <option value="partnership">Kerjasama</option>
                      <option value="other">Lainnya</option>
                    </select>
                  </div>
                  
                  <div>
                    <label 
                      htmlFor="message"
                      className="block text-sm font-medium mb-2"
                      style={{ color: '#2B2118' }}
                    >
                      Pesan
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border outline-none resize-none transition-all duration-300 focus:shadow-md"
                      style={{ 
                        borderColor: '#E0D6C8', 
                        backgroundColor: '#FFFDF9',
                        color: '#2B2118',
                      }}
                      placeholder="Tulis pesan Anda..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 font-semibold rounded-xl transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                    style={{ backgroundColor: '#6F4E37', color: '#FFFDF9' }}
                  >
                    {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info with Custom Icons */}
            <div className="space-y-6">
              <h2 
                className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-6"
                style={{ color: '#2B2118' }}
              >
                Informasi Kontak
              </h2>
              
              {contactInfo.map((info, index) => {
                const IconComponent = info.Icon;
                return (
                  <div 
                    key={index}
                    className="flex items-start gap-4 p-5 rounded-xl transition-all duration-300 hover:shadow-md"
                    style={{ backgroundColor: '#FFFDF9', border: '1px solid #E0D6C8' }}
                  >
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: info.bgColor }}
                    >
                      <IconComponent className="w-6 h-6" color="#FFFDF9" />
                    </div>
                    <div>
                      <h3 
                        className="font-semibold mb-1"
                        style={{ color: '#2B2118' }}
                      >
                        {info.title}
                      </h3>
                      <p 
                        className="text-sm whitespace-pre-line"
                        style={{ color: '#5C4A3D' }}
                      >
                        {info.content}
                      </p>
                    </div>
                  </div>
                );
              })}
              
              {/* Map Placeholder with Icon */}
              <div 
                className="h-64 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: '#EBE4D8', border: '1px solid #E0D6C8' }}
              >
                <div className="text-center">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{ backgroundColor: 'rgba(111, 78, 55, 0.2)' }}
                  >
                    <LocationIcon className="w-8 h-8" color="#6F4E37" />
                  </div>
                  <p style={{ color: '#5C4A3D' }}>Google Maps akan ditampilkan di sini</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

