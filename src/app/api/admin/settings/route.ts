import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/settings
 * Get all site settings
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const allSettings = await prisma.siteSetting.findMany();

    // Group by group field
    const settings: Record<string, Record<string, string>> = {
      identity: {},
      contact: {},
      social: {},
      footer: {},
    };

    allSettings.forEach((setting) => {
      if (settings[setting.group]) {
        settings[setting.group][setting.key] = setting.value;
      }
    });

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil pengaturan' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/settings
 * Update site settings
 */
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { settings } = body;

    if (!settings) {
      return NextResponse.json(
        { error: 'Settings diperlukan' },
        { status: 400 }
      );
    }

    // Update or create each setting
    const updates: Promise<unknown>[] = [];

    for (const group of Object.keys(settings)) {
      for (const key of Object.keys(settings[group])) {
        const value = settings[group][key];
        updates.push(
          prisma.siteSetting.upsert({
            where: { key },
            update: { value, group },
            create: { key, value, group, label: key, type: 'text' },
          })
        );
      }
    }

    await Promise.all(updates);

    return NextResponse.json({ message: 'Pengaturan berhasil disimpan' });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      { error: 'Gagal menyimpan pengaturan' },
      { status: 500 }
    );
  }
}
