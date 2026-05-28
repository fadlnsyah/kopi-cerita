import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Prisma } from '@prisma/client';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type ModifierOption = { label: string; price: number };
type ModifierSnapshot = {
  name: string;
  type: string;
  options: ModifierOption[];
};

function getEffectivePrice(product: { price: number; discountPercent: number | null }) {
  if (product.discountPercent && product.discountPercent > 0) {
    return Math.round(product.price * (1 - product.discountPercent / 100));
  }

  return product.price;
}

function getModifiersHash(modifiers: ModifierSnapshot[]) {
  return JSON.stringify(
    modifiers
      .map((modifier) => ({
        name: modifier.name,
        options: modifier.options.map((option) => option.label).sort(),
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  );
}

function getModifierPrice(modifiers: ModifierSnapshot[]) {
  return modifiers.reduce(
    (sum, modifier) => sum + modifier.options.reduce((optionSum, option) => optionSum + option.price, 0),
    0
  );
}

function parseModifierOptions(options: Prisma.JsonValue): ModifierOption[] {
  if (!Array.isArray(options)) return [];

  return options
    .map((option) => {
      if (!option || typeof option !== 'object' || Array.isArray(option)) return null;
      const record = option as Record<string, unknown>;
      if (typeof record.label !== 'string') return null;

      return {
        label: record.label,
        price: typeof record.price === 'number' ? record.price : 0,
      };
    })
    .filter((option): option is ModifierOption => Boolean(option));
}

function normalizeModifiers(
  productModifiers: { name: string; type: string; required: boolean; options: Prisma.JsonValue }[],
  selectedModifiers: Record<string, string | string[]>
) {
  const snapshots: ModifierSnapshot[] = [];

  for (const modifier of productModifiers) {
    const options = parseModifierOptions(modifier.options);
    const selected = selectedModifiers[modifier.name];
    const selectedLabels = Array.isArray(selected)
      ? selected
      : selected
        ? [selected]
        : [];

    if (modifier.required && selectedLabels.length === 0) {
      throw new Error(`${modifier.name} wajib dipilih`);
    }

    if (modifier.type !== 'multi' && selectedLabels.length > 1) {
      throw new Error(`${modifier.name} hanya boleh memilih satu opsi`);
    }

    const selectedOptions = selectedLabels.map((label) => {
      const option = options.find((item) => item.label === label);
      if (!option) {
        throw new Error(`Opsi ${label} tidak valid untuk ${modifier.name}`);
      }

      return option;
    });

    if (selectedOptions.length > 0) {
      snapshots.push({
        name: modifier.name,
        type: modifier.type,
        options: selectedOptions,
      });
    }
  }

  return snapshots;
}

/**
 * GET /api/cart
 * Ambil cart user yang sedang login
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Cari atau buat cart untuk user
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                discountPercent: true,
                category: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                price: true,
                discountPercent: true,
                category: true,
                image: true,
                },
              },
            },
          },
        },
      });
    }

    // Transform data untuk frontend
    const cartItems = cart.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      price: getEffectivePrice(item.product) + getModifierPrice((item.modifiers as ModifierSnapshot[] | null) || []),
      originalPrice: item.product.price,
      discountPercent: item.product.discountPercent,
      category: item.product.category,
      image: item.product.image,
      quantity: item.quantity,
      modifiers: item.modifiers || [],
    }));

    return NextResponse.json({ items: cartItems });
  } catch (error) {
    console.error('Get cart error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil cart' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cart
 * Tambah item ke cart
 * Body: { productId: string, quantity?: number }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, quantity = 1, modifiers = {} } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID diperlukan' },
        { status: 400 }
      );
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json(
        { error: 'Quantity tidak valid' },
        { status: 400 }
      );
    }

    // Cek apakah product ada
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        modifiers: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Produk tidak ditemukan' },
        { status: 404 }
      );
    }

    // Cari atau buat cart
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id },
      });
    }

    let normalizedModifiers: ModifierSnapshot[];
    try {
      normalizedModifiers = normalizeModifiers(product.modifiers, modifiers);
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Modifier tidak valid' },
        { status: 400 }
      );
    }
    const modifiersHash = getModifiersHash(normalizedModifiers);

    // Cek apakah item sudah ada di cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId_modifiersHash: {
          cartId: cart.id,
          productId: productId,
          modifiersHash,
        },
      },
    });

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Tambah item baru
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productId,
          quantity: quantity,
          modifiersHash,
          modifiers: normalizedModifiers as unknown as Prisma.InputJsonValue,
        },
      });
    }

    return NextResponse.json({ message: 'Item ditambahkan ke cart' });
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan ke cart' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/cart
 * Update quantity item
 * Body: { itemId: string, quantity: number }
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { itemId, quantity } = body;

    if (!itemId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Item ID dan quantity diperlukan' },
        { status: 400 }
      );
    }

    // Verifikasi item milik user
    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!item || item.cart.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Item tidak ditemukan' },
        { status: 404 }
      );
    }

    if (quantity <= 0) {
      // Hapus item
      await prisma.cartItem.delete({
        where: { id: itemId },
      });
      return NextResponse.json({ message: 'Item dihapus dari cart' });
    }

    // Update quantity
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return NextResponse.json({ message: 'Quantity diperbarui' });
  } catch (error) {
    console.error('Update cart error:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui cart' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cart?itemId=xxx
 * Hapus item dari cart
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID diperlukan' },
        { status: 400 }
      );
    }

    // Verifikasi item milik user
    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!item || item.cart.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Item tidak ditemukan' },
        { status: 404 }
      );
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ message: 'Item dihapus dari cart' });
  } catch (error) {
    console.error('Delete cart item error:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus item' },
      { status: 500 }
    );
  }
}
