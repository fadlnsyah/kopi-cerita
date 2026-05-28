import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { compare, hash } from 'bcryptjs';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        points: true,
        memberTier: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Akun tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Get account error:', error);
    return NextResponse.json({ error: 'Gagal mengambil akun' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, address, currentPassword, newPassword } = body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'Nama minimal 2 karakter' }, { status: 400 });
    }

    const data: {
      name: string;
      phone: string | null;
      address: string | null;
      password?: string;
    } = {
      name: name.trim(),
      phone: phone?.trim() || null,
      address: address?.trim() || null,
    };

    if (newPassword) {
      if (typeof newPassword !== 'string' || newPassword.length < 6) {
        return NextResponse.json({ error: 'Password baru minimal 6 karakter' }, { status: 400 });
      }

      if (!currentPassword) {
        return NextResponse.json({ error: 'Password lama wajib diisi' }, { status: 400 });
      }

      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { password: true },
      });

      if (!user || !(await compare(currentPassword, user.password))) {
        return NextResponse.json({ error: 'Password lama salah' }, { status: 400 });
      }

      data.password = await hash(newPassword, 12);
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        points: true,
        memberTier: true,
      },
    });

    return NextResponse.json({ message: 'Akun berhasil diperbarui', user });
  } catch (error) {
    console.error('Update account error:', error);
    return NextResponse.json({ error: 'Gagal memperbarui akun' }, { status: 500 });
  }
}
