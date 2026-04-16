import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const paymentMethod = searchParams.get('paymentMethod');

    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let query = supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (startDate) {
      query = query.gte('created_at', new Date(startDate).toISOString());
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query = query.lte('created_at', end.toISOString());
    }

    if (paymentMethod && paymentMethod !== 'all') {
      query = query.eq('payment_method', paymentMethod);
    }

    const { data: transactions, error } = await query;

    if (error) throw error;

    // Calculate aggregated data
    const totalRevenue = transactions.reduce(
      (sum, txn) => sum + (parseFloat(txn.amount) || 0),
      0
    );

    const byPaymentMethod = transactions.reduce(
      (acc: any, txn) => {
        const method = txn.payment_method || 'Unknown';
        acc[method] = (acc[method] || 0) + (parseFloat(txn.amount) || 0);
        return acc;
      },
      {}
    );

    const byType = transactions.reduce(
      (acc: any, txn) => {
        const type = txn.type || 'Other';
        acc[type] = (acc[type] || 0) + (parseFloat(txn.amount) || 0);
        return acc;
      },
      {}
    );

    // Daily breakdown
    const dailyData: any = {};
    transactions.forEach((txn) => {
      const date = new Date(txn.created_at).toLocaleDateString();
      dailyData[date] = (dailyData[date] || 0) + (parseFloat(txn.amount) || 0);
    });

    const dailyBreakdown = Object.entries(dailyData)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return NextResponse.json({
      totalRevenue,
      transactionCount: transactions.length,
      averageTransaction: totalRevenue / (transactions.length || 1),
      byPaymentMethod,
      byType,
      dailyBreakdown,
      transactions,
    });
  } catch (error: any) {
    console.error('Financial report error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
