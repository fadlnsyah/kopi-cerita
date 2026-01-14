'use client';

import { useEffect, useState } from 'react';

interface Settings {
  homepage: Record<string, string>;
  social: Record<string, string>;
}

const homepageFields = [
  { key: 'hero_title', label: 'Judul Hero', placeholder: 'Setiap Kopi Punya Cerita' },
  { key: 'hero_subtitle', label: 'Subtitle Hero', placeholder: 'Nikmati pengalaman ngopi yang berbeda...' },
  { key: 'hero_cta', label: 'Teks Tombol CTA', placeholder: 'Pesan Sekarang' },
  { key: 'about_text', label: 'Teks About', placeholder: 'Deskripsi singkat tentang Kopi Cerita' },
];

const socialFields = [
  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/kopicerita', icon: '📷' },
  { key: 'whatsapp', label: 'WhatsApp', placeholder: '6281234567890', icon: '💬' },
  { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/kopicerita', icon: '👍' },
  { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@kopicerita', icon: '🎵' },
  { key: 'twitter', label: 'Twitter/X', placeholder: 'https://twitter.com/kopicerita', icon: '🐦' },
];

/**
 * Admin Settings Page
 */
export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'homepage' | 'social'>('homepage');
  const [settings, setSettings] = useState<Settings>({
    homepage: {},
    social: {},
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (category: 'homepage' | 'social', key: string, value: string) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value,
      },
    });
    setMessage({ type: '', text: '' });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Pengaturan berhasil disimpan!' });
      } else {
        setMessage({ type: 'error', text: 'Gagal menyimpan pengaturan' });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Terjadi kesalahan' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div style={{ color: '#5C4A3D' }}>Memuat pengaturan...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)]" style={{ color: '#2B2118' }}>Pengaturan</h2>
        <p className="font-[family-name:var(--font-body)]" style={{ color: '#5C4A3D' }}>Kelola tampilan dan informasi website</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('homepage')}
          className="px-4 py-2 rounded-lg font-medium transition-colors"
          style={activeTab === 'homepage'
            ? { backgroundColor: '#6F4E37', color: '#FFFDF9' }
            : { backgroundColor: '#E0D6C8', color: '#5C4A3D' }
          }
        >
          🏠 Homepage
        </button>
        <button
          onClick={() => setActiveTab('social')}
          className="px-4 py-2 rounded-lg font-medium transition-colors"
          style={activeTab === 'social'
            ? { backgroundColor: '#6F4E37', color: '#FFFDF9' }
            : { backgroundColor: '#E0D6C8', color: '#5C4A3D' }
          }
        >
          🔗 Social Media
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <div
          className="p-4 rounded-lg"
          style={message.type === 'success'
            ? { backgroundColor: '#D1FAE5', color: '#059669' }
            : { backgroundColor: '#FEE2E2', color: '#DC2626' }
          }
        >
          {message.text}
        </div>
      )}

      {/* Content */}
      <div
        className="p-6 rounded-xl space-y-6 shadow-sm"
        style={{ backgroundColor: '#FFFDF9', border: '1px solid #E0D6C8' }}
      >
        {activeTab === 'homepage' && (
          <>
            <h3 className="text-lg font-semibold" style={{ color: '#2B2118' }}>Pengaturan Homepage</h3>
            <div className="space-y-4">
              {homepageFields.map((field) => (
                <div key={field.key}>
                  <label className="block mb-2" style={{ color: '#5C4A3D' }}>{field.label}</label>
                  {field.key === 'about_text' ? (
                    <textarea
                      value={settings.homepage[field.key] || ''}
                      onChange={(e) => handleChange('homepage', field.key, e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 resize-none"
                      style={{ borderColor: '#E0D6C8', backgroundColor: '#FFFDF9', color: '#2B2118' }}
                      placeholder={field.placeholder}
                    />
                  ) : (
                    <input
                      type="text"
                      value={settings.homepage[field.key] || ''}
                      onChange={(e) => handleChange('homepage', field.key, e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                      style={{ borderColor: '#E0D6C8', backgroundColor: '#FFFDF9', color: '#2B2118' }}
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'social' && (
          <>
            <h3 className="text-lg font-semibold" style={{ color: '#2B2118' }}>Social Media Links</h3>
            <div className="space-y-4">
              {socialFields.map((field) => (
                <div key={field.key}>
                  <label className="block mb-2" style={{ color: '#5C4A3D' }}>
                    {field.icon} {field.label}
                  </label>
                  <input
                    type="text"
                    value={settings.social[field.key] || ''}
                    onChange={(e) => handleChange('social', field.key, e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                    style={{ borderColor: '#E0D6C8', backgroundColor: '#FFFDF9', color: '#2B2118' }}
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Save Button */}
        <div className="pt-4" style={{ borderTop: '1px solid #E0D6C8' }}>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 rounded-lg font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: '#6F4E37' }}
          >
            {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  );
}
