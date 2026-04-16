import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status'); // 'expiring', 'expired', 'active', 'all'

    let query = supabase
      .from('members')
      .select('*')
      .order('renewal_date', { ascending: true });

    if (status && status !== 'all') {
      const today = new Date();
      const sevenDaysLater = new Date(today);
      sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

      if (status === 'expiring') {
        // Expiring within 7 days
        query = query
          .lte('renewal_date', sevenDaysLater.toISOString().split('T')[0])
          .gt('renewal_date', today.toISOString().split('T')[0]);
      } else if (status === 'expired') {
        // Already expired
        query = query.lt('renewal_date', today.toISOString().split('T')[0]);
      } else if (status === 'active') {
        // Not yet expiring
        query = query.gte('renewal_date', sevenDaysLater.toISOString().split('T')[0]);
      }
    }

    const { data: members, error } = await query;

    if (error) throw error;

    // Calculate stats
    const today = new Date();
    const sevenDaysLater = new Date(today);
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

    const expiring = members.filter(
      (m) =>
        new Date(m.renewal_date) <= sevenDaysLater &&
        new Date(m.renewal_date) > today
    );

    const expired = members.filter((m) => new Date(m.renewal_date) < today);

    const active = members.filter(
      (m) => new Date(m.renewal_date) >= sevenDaysLater
    );

    // Enhanced member data with days until expiry
    const enrichedMembers = members.map((member) => {
      const renewalDate = new Date(member.renewal_date);
      const daysUntilExpiry = Math.ceil(
        (renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        ...member,
        daysUntilExpiry,
        status:
          daysUntilExpiry < 0
            ? 'expired'
            : daysUntilExpiry <= 7
              ? 'expiring'
              : 'active',
      };
    });

    return NextResponse.json({
      members: enrichedMembers,
      stats: {
        total: members.length,
        active: active.length,
        expiring: expiring.length,
        expired: expired.length,
      },
    });
  } catch (error: any) {
    console.error('Renewal tracking error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
