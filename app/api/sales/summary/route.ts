import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const firstDayOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    )
      .toISOString()
      .split('T')[0];

    // Get transactions for this month grouped by type
    const { data: transactions } = await supabase
      .from('transactions')
      .select('*')
      .gte('created_at', firstDayOfMonth);

    // Calculate aggregated data
    const typeBreakdown: Record<string, number> = {};
    const methodBreakdown: Record<string, number> = {};
    let totalRevenue = 0;

    transactions?.forEach((txn: any) => {
      const amount = parseFloat(txn.amount) || 0;
      totalRevenue += amount;

      // By type
      const type = txn.type || 'Other';
      typeBreakdown[type] = (typeBreakdown[type] || 0) + amount;

      // By method
      const method = txn.payment_method || 'cash';
      methodBreakdown[method] = (methodBreakdown[method] || 0) + amount;
    });

    // Get top transactions
    const { data: topTransactions } = await supabase
      .from('transactions')
      .select('*')
      .gte('created_at', firstDayOfMonth)
      .order('amount', { ascending: false })
      .limit(10);

    // Calculate daily breakdown
    const dailyBreakdown: Record<string, number> = {};
    transactions?.forEach((txn: any) => {
      const date = new Date(txn.created_at).toLocaleDateString();
      dailyBreakdown[date] =
        (dailyBreakdown[date] || 0) + (parseFloat(txn.amount) || 0);
    });

    return NextResponse.json({
      totalRevenue,
      transactionCount: transactions?.length || 0,
      typeBreakdown,
      methodBreakdown,
      topTransactions: topTransactions || [],
      dailyBreakdown,
    });
  } catch (error: any) {
    console.error('Sales summary error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
