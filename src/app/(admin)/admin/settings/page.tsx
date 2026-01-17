'use client';

import { useState, useEffect } from 'react';

interface Setting {
  id: string;
  key: string;
  value: string;
  label: string;
  group: string;
  type: string;
}

const groupLabels: Record<string, { label: string; description: string }> = {
  identity: { 
    label: '🏪 Identitas Toko', 
    description: 'Nama, tagline, dan deskripsi toko' 
  },
  contact: { 
    label: '📞 Kontak', 
    description: 'Email, telepon, dan alamat toko' 
  },
  social: { 
    label: '📱 Media Sosial', 
    description: 'Link media sosial (kosongkan jika tidak ada)' 
  },
  footer: { 
    label: '📝 Footer', 
    description: 'Teks yang muncul di bagian bawah website' 
  },
};

/**
 * Admin Settings Page - Pengaturan Toko
 */
export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('identity');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        const data = await response.json();
        setSettings(data.settings || []);
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, value } : s))
    );
    setMessage(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: settings.map((s) => ({ key: s.key, value: s.value })),
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Pengaturan berhasil disimpan!' });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Gagal menyimpan pengaturan' });
    } finally {
      setSaving(false);
    }
  };

  // Group settings
  const groupedSettings = settings.reduce((acc, setting) => {
    if (!acc[setting.group]) {
      acc[setting.group] = [];
    }
    acc[setting.group].push(setting);
    return acc;
  }, {} as Record<string, Setting[]>);

  const tabs = ['identity', 'contact', 'social', 'footer'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div 
            className="inline-block w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" 
            style={{ borderColor: '#6F4E37', borderTopColor: 'transparent' }}
          />
          <p className="mt-4" style={{ color: '#5C4A3D' }}>Memuat pengaturan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h2 
          className="text-2xl font-bold font-[family-name:var(--font-heading)]" 
          style={{ color: '#2B2118' }}
        >
          ⚙️ Pengaturan Toko
        </h2>
        <p style={{ color: '#5C4A3D' }}>
          Kelola identitas, kontak, dan media sosial toko
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 rounded-lg font-medium transition-all"
            style={activeTab === tab
              ? { backgroundColor: '#6F4E37', color: '#FFFDF9' }
              : { backgroundColor: '#E0D6C8', color: '#5C4A3D' }
            }
          >
            {groupLabels[tab]?.label || tab}
          </button>
        ))}
      </div>

      {/* Message */}
      {message && (
        <div 
          className="p-4 rounded-xl animate-fade-in-up"
          style={{ 
            backgroundColor: message.type === 'success' ? '#D1FAE5' : '#FEE2E2',
            color: message.type === 'success' ? '#059669' : '#DC2626',
          }}
        >
          {message.text}
        </div>
      )}

      {/* Settings Form */}
      <div
        className="p-6 rounded-xl shadow-sm"
        style={{ backgroundColor: '#FFFDF9', border: '1px solid #E0D6C8' }}
      >
        <h3 
          className="text-lg font-semibold mb-2" 
          style={{ color: '#2B2118' }}
        >
          {groupLabels[activeTab]?.label}
        </h3>
        <p className="text-sm mb-6" style={{ color: '#8B7355' }}>
          {groupLabels[activeTab]?.description}
        </p>

        <div className="space-y-4">
          {groupedSettings[activeTab]?.map((setting) => (
            <div key={setting.key}>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: '#5C4A3D' }}
              >
                {setting.label}
              </label>
              {setting.type === 'textarea' ? (
                <textarea
                  value={setting.value}
                  onChange={(e) => handleChange(setting.key, e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border outline-none transition-all focus:shadow-md resize-none"
                  style={{ 
                    borderColor: '#E0D6C8',
                    backgroundColor: '#F5EFE6',
                    color: '#2B2118',
                  }}
                />
              ) : (
                <input
                  type={setting.type === 'email' ? 'email' : setting.type === 'url' ? 'url' : 'text'}
                  value={setting.value}
                  onChange={(e) => handleChange(setting.key, e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border outline-none transition-all focus:shadow-md"
                  style={{ 
                    borderColor: '#E0D6C8',
                    backgroundColor: '#F5EFE6',
                    color: '#2B2118',
                  }}
                  placeholder={setting.type === 'url' ? 'https://...' : ''}
                />
              )}
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="mt-6 pt-6" style={{ borderTop: '1px solid #E0D6C8' }}>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg disabled:opacity-50"
            style={{ backgroundColor: '#6F4E37', color: '#FFFDF9' }}
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                Menyimpan...
              </span>
            ) : (
              '💾 Simpan Perubahan'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
