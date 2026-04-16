import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getAttendanceByMember, recordReminderSent } from '@/lib/database';
import { sendInactiveMemberAlert } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get inactive days threshold from request body
    const { inactiveDays = 30, dryRun = false } = await request.json().catch(() => ({}));

    // Get all members
    const { data: members } = await supabase
      .from('members')
      .select('id, name, email')
      .order('created_at', { ascending: true });

    if (!members || members.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No members found',
        sent: 0,
        failed: 0,
      });
    }

    let sent = 0;
    let failed = 0;
    const errors: any[] = [];
    const inactiveThreshold = new Date();
    inactiveThreshold.setDate(inactiveThreshold.getDate() - inactiveDays);

    // Check each member's last attendance
    for (const member of members) {
      try {
        const attendance = await getAttendanceByMember(member.id, undefined, undefined);
        
        if (!attendance || attendance.length === 0) {
          // No attendance records at all
          if (!member.email) {
            failed++;
            continue;
          }

          if (!dryRun) {
            await sendInactiveMemberAlert(member.email, member.name, 'Never (no attendance records)');
            await recordReminderSent(member.id, 'inactive');
          }
          sent++;
        } else {
          const lastAttendance = new Date(attendance[attendance.length - 1].check_in_time);
          
          if (lastAttendance < inactiveThreshold) {
            if (!member.email) {
              failed++;
              continue;
            }

            if (!dryRun) {
              const lastAttendanceDate = lastAttendance.toLocaleDateString();
              await sendInactiveMemberAlert(member.email, member.name, lastAttendanceDate);
              await recordReminderSent(member.id, 'inactive');
            }
            sent++;
          }
        }
      } catch (error) {
        failed++;
        errors.push({
          memberId: member.id,
          email: member.email,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Inactive member alerts processing complete`,
      sent,
      failed,
      total: members.length,
      inactiveDays,
      dryRun,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Error sending inactive member alerts:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const inactiveDays = parseInt(request.nextUrl.searchParams.get('days') || '30');
    const inactiveThreshold = new Date();
    inactiveThreshold.setDate(inactiveThreshold.getDate() - inactiveDays);

    const { data: members } = await supabase
      .from('members')
      .select('id, name, email')
      .order('updated_at', { ascending: true })
      .limit(50);

    return NextResponse.json({
      success: true,
      count: members?.length || 0,
      members: members || [],
      inactiveDays,
      threshold: inactiveThreshold.toISOString().split('T')[0],
    });
  } catch (error) {
    console.error('Error fetching inactive members:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
