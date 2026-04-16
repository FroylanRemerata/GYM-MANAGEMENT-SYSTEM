import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get auth token from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    // Verify token with Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];
    const today = now.toISOString().split('T')[0];

    // Get total members
    const { count: totalMembers } = await supabase
      .from('members')
      .select('id', { count: 'exact', head: true });

    // Get active members
    const { count: activeMembers } = await supabase
      .from('members')
      .select('id', { count: 'exact', head: true })
      .gte('renewal_date', today);

    // Get expiring soon (within 7 days)
    const { count: expiringMembers } = await supabase
      .from('members')
      .select('id', { count: 'exact', head: true })
      .lte('renewal_date', sevenDaysFromNow)
      .gt('renewal_date', today);

    // Get monthly revenue
    const firstDayOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    )
      .toISOString()
      .split('T')[0];

    const { data: transactions } = await supabase
      .from('transactions')
      .select('amount')
      .gte('created_at', firstDayOfMonth);

    const monthlyRevenue =
      transactions?.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0) ||
      0;

    // Get recent members
    const { data: recentMembers } = await supabase
      .from('members')
      .select('id, name, membership_type, renewal_date, status')
      .order('created_at', { ascending: false })
      .limit(5);

    // Get recent activity
    const { data: recentAttendance } = await supabase
      .from('attendance')
      .select('member_id, attended_at, members(name)')
      .order('attended_at', { ascending: false })
      .limit(5);

    // Get plan distribution
    const { data: membersByPlan } = await supabase
      .from('members')
      .select('membership_type');

    const planDistribution: Record<string, number> = {};
    membersByPlan?.forEach((m: any) => {
      const type = m.membership_type || 'basic';
      planDistribution[type] = (planDistribution[type] || 0) + 1;
    });

    return NextResponse.json({
      stats: {
        totalMembers: totalMembers || 0,
        activeMembers: activeMembers || 0,
        expiringMembers: expiringMembers || 0,
        monthlyRevenue,
      },
      recentMembers: recentMembers || [],
      recentActivity: recentAttendance || [],
      planDistribution,
    });
  } catch (error: any) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
