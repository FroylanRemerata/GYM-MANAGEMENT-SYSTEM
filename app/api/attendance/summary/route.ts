import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const memberId = searchParams.get('memberId');
    const month = searchParams.get('month'); // YYYY-MM format

    let query = supabase
      .from('attendance')
      .select('*, members(name)')
      .order('attended_at', { ascending: true });

    if (memberId) {
      query = query.eq('member_id', memberId);
    }

    if (month) {
      const [year, monthNum] = month.split('-');
      const startDate = `${year}-${monthNum}-01`;
      const endDate = new Date(parseInt(year), parseInt(monthNum), 0)
        .toISOString()
        .split('T')[0];
      query = query
        .gte('attended_at', startDate)
        .lte('attended_at', endDate);
    }

    const { data: attendance, error } = await query;

    if (error) throw error;

    // If no memberId, get all members with their recent attendance
    if (!memberId) {
      const { data: members } = await supabase
        .from('members')
        .select('id, name');

      const memberAttendance = (members || []).map((member: any) => {
        const daysInMonth = new Date().getDate();
        const memberDays = new Array(daysInMonth).fill(false);
        
        attendance
          ?.filter((a: any) => a.member_id === member.id)
          .forEach((a: any) => {
            const day = new Date(a.attended_at).getDate();
            memberDays[day - 1] = true;
          });

        return {
          memberId: member.id,
          member: member.name,
          month: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          days: memberDays,
          attendanceCount: memberDays.filter(Boolean).length,
          attendancePercentage: Math.round(
            (memberDays.filter(Boolean).length / daysInMonth) * 100
          ),
        };
      });

      return NextResponse.json({ attendance: memberAttendance });
    }

    // If memberId specified, return detailed attendance for that member
    return NextResponse.json({
      attendance: attendance || [],
    });
  } catch (error: any) {
    console.error('Attendance error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
