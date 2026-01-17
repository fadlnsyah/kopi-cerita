import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSiteSettings } from '@/lib/settings';

// GET - Ambil semua settings (public untuk footer, full untuk admin)
export async function GET(request: NextRequest) {
  try {
    const { list, map } = await getSiteSettings();
    const { searchParams } = new URL(request.url);
    const group = searchParams.get('group');

    // Filter by group if requested
    const filteredList = group 
      ? list.filter(s => s.group === group)
      : list;

    return NextResponse.json({
      settings: filteredList,
      values: map,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil pengaturan' },
      { status: 500 }
    );
  }
}

// PUT - Update settings (admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { settings } = body; // Array of { key, value }
    
    if (!settings || !Array.isArray(settings)) {
      return NextResponse.json(
        { error: 'Format data tidak valid' },
        { status: 400 }
      );
    }
    
    // Update each setting
    const updates = settings.map((s: { key: string; value: string }) =>
      prisma.siteSetting.update({
        where: { key: s.key },
        data: { value: s.value },
      })
    );
    
    await Promise.all(updates);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate pengaturan' },
      { status: 500 }
    );
  }
}
