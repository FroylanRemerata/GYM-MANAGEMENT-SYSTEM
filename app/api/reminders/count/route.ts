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

    // Get count of pending reminders
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    // Count members expiring soon (renewal reminders)
    const { count: renewalCount } = await supabase
      .from('members')
      .select('id', { count: 'exact', head: true })
      .lte('renewal_date', sevenDaysFromNow)
      .gt('renewal_date', now.toISOString().split('T')[0]);

    // Count inactive members (inactivity alerts)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const { data: members } = await supabase
      .from('members')
      .select('id');

    const { data: recentAttendance } = await supabase
      .from('attendance')
      .select('member_id, attended_at')
      .gte('attended_at', thirtyDaysAgo);

    const attendedMembers = new Set(recentAttendance?.map((a: any) => a.member_id));
    const inactiveCount = (members || []).filter((m: any) => !attendedMembers.has(m.id)).length;

    // Count low stock items
    const { count: lowStockCount } = await supabase
      .from('inventory_items')
      .select('id', { count: 'exact', head: true })
      .lt('quantity', 'reorder_level');

    const totalPendingReminders = (renewalCount || 0) + inactiveCount + (lowStockCount || 0);

    return NextResponse.json({
      totalPending: totalPendingReminders,
      renewalCount: renewalCount || 0,
      inactiveCount,
      lowStockCount: lowStockCount || 0,
    });
  } catch (error: any) {
    console.error('Reminders count error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
