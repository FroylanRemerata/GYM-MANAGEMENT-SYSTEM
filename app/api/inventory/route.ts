import { NextResponse } from 'next/server';
import { getInventoryItems, getInventoryItemById, createInventoryItem, updateInventoryItem, deleteInventoryItem } from '@/lib/database';

// GET all inventory items or specific item
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const item = await getInventoryItemById(id);
      return NextResponse.json({ success: true, data: item });
    }

    const items = await getInventoryItems();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch inventory' },
      { status: 400 }
    );
  }
}

// POST create new inventory item
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const item = await createInventoryItem(body);
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to create inventory item' },
      { status: 400 }
    );
  }
}

// PUT update inventory item
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Item ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const item = await updateInventoryItem(id, body);
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to update inventory item' },
      { status: 400 }
    );
  }
}

// DELETE inventory item
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Item ID is required' },
        { status: 400 }
      );
    }

    await deleteInventoryItem(id);
    return NextResponse.json({ success: true, message: 'Inventory item deleted' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to delete inventory item' },
      { status: 400 }
    );
  }
}
