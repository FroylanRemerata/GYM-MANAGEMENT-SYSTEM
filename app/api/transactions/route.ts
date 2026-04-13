import { NextResponse } from 'next/server';
import { getTransactions, getTransactionsByMember, createTransaction, updateTransaction, deleteTransaction } from '@/lib/database';

// GET all transactions or by member
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('memberId');

    if (memberId) {
      const transactions = await getTransactionsByMember(memberId);
      return NextResponse.json({ success: true, data: transactions });
    }

    const transactions = await getTransactions();
    return NextResponse.json({ success: true, data: transactions });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch transactions' },
      { status: 400 }
    );
  }
}

// POST create transaction
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const transaction = await createTransaction(body);
    return NextResponse.json({ success: true, data: transaction }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to create transaction' },
      { status: 400 }
    );
  }
}

// PUT update transaction
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const transaction = await updateTransaction(id, body);
    return NextResponse.json({ success: true, data: transaction });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to update transaction' },
      { status: 400 }
    );
  }
}

// DELETE transaction
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    await deleteTransaction(id);
    return NextResponse.json({ success: true, message: 'Transaction deleted' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to delete transaction' },
      { status: 400 }
    );
  }
}
