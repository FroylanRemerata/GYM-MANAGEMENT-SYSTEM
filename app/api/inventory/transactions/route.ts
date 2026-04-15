import { NextResponse } from 'next/server';
import { getInventoryTransactions, createInventoryTransaction } from '@/lib/database';

// GET inventory transactions
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');

    const transactions = await getInventoryTransactions(itemId || undefined);
    return NextResponse.json({ success: true, data: transactions });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch inventory transactions' },
      { status: 400 }
    );
  }
}

// POST create inventory transaction
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const transaction = await createInventoryTransaction(body);
    return NextResponse.json({ success: true, data: transaction }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to create inventory transaction' },
      { status: 400 }
    );
  }
}
