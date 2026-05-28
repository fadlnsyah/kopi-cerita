'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface AccountForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function AccountPage() {
  const router = useRouter();
  const { status, update } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState<AccountForm>({
    name: '',
    email: '',
    phone: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;

    const fetchAccount = async () => {
      try {
        const response = await fetch('/api/account');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Gagal mengambil akun');
        }

        setFormData((prev) => ({
          ...prev,
          name: data.user.name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          address: data.user.address || '',
        }));
      } catch (error) {
        setMessage({
          type: 'error',
          text: error instanceof Error ? error.message : 'Gagal mengambil akun',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccount();
  }, [status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Konfirmasi password baru tidak sama' });
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch('/api/account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal menyimpan akun');
      }

      setFormData((prev) => ({
        ...prev,
        name: data.user.name || '',
        phone: data.user.phone || '',
        address: data.user.address || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      await update({ user: { name: data.user.name } });
      router.refresh();
      setMessage({ type: 'success', text: 'Akun berhasil diperbarui' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Gagal menyimpan akun',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <main className="min-h-screen pt-24 pb-16" style={{ backgroundColor: '#F5EFE6' }}>
        <div className="container">
          <div className="text-center py-16" style={{ color: '#5C4A3D' }}>
            Memuat akun...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16" style={{ backgroundColor: '#F5EFE6' }}>
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <p className="font-semibold tracking-widest uppercase text-sm mb-3" style={{ color: '#7A8450' }}>
              Akun
            </p>
            <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold" style={{ color: '#2B2118' }}>
              Pengaturan Akun
            </h1>
            <p className="mt-2" style={{ color: '#5C4A3D' }}>
              Kelola profil, kontak, alamat, dan password akun kamu.
            </p>
          </div>

          {message && (
            <div
              className="mb-6 p-4 rounded-xl"
              style={{
                backgroundColor: message.type === 'success' ? '#D1FAE5' : '#FEE2E2',
                color: message.type === 'success' ? '#059669' : '#DC2626',
              }}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <section className="p-6 rounded-xl" style={{ backgroundColor: '#FFFDF9', border: '1px solid #E0D6C8' }}>
              <h2 className="text-xl font-bold mb-5" style={{ color: '#2B2118' }}>Profil</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#5C4A3D' }}>Nama Lengkap</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border outline-none"
                    style={{ borderColor: '#E0D6C8', backgroundColor: '#F5EFE6', color: '#2B2118' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#5C4A3D' }}>Email</label>
                  <input
                    value={formData.email}
                    readOnly
                    className="w-full px-4 py-3 rounded-xl border outline-none opacity-80"
                    style={{ borderColor: '#E0D6C8', backgroundColor: '#EBE4D8', color: '#5C4A3D' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#5C4A3D' }}>Nomor WhatsApp</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border outline-none"
                    style={{ borderColor: '#E0D6C8', backgroundColor: '#F5EFE6', color: '#2B2118' }}
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2" style={{ color: '#5C4A3D' }}>Alamat</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border outline-none resize-none"
                  style={{ borderColor: '#E0D6C8', backgroundColor: '#F5EFE6', color: '#2B2118' }}
                  placeholder="Alamat untuk data pesanan"
                />
              </div>
            </section>

            <section className="p-6 rounded-xl" style={{ backgroundColor: '#FFFDF9', border: '1px solid #E0D6C8' }}>
              <h2 className="text-xl font-bold mb-5" style={{ color: '#2B2118' }}>Ganti Password</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#5C4A3D' }}>Password Lama</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border outline-none"
                    style={{ borderColor: '#E0D6C8', backgroundColor: '#F5EFE6', color: '#2B2118' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#5C4A3D' }}>Password Baru</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border outline-none"
                    style={{ borderColor: '#E0D6C8', backgroundColor: '#F5EFE6', color: '#2B2118' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#5C4A3D' }}>Konfirmasi</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border outline-none"
                    style={{ borderColor: '#E0D6C8', backgroundColor: '#F5EFE6', color: '#2B2118' }}
                  />
                </div>
              </div>
            </section>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full md:w-auto px-8 py-4 rounded-xl font-semibold transition-all hover:shadow-lg disabled:opacity-50"
              style={{ backgroundColor: '#6F4E37', color: '#FFFDF9' }}
            >
              {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
