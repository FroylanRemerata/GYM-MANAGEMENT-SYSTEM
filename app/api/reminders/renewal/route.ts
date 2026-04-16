import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getMembersNeedingRenewalReminders, recordReminderSent } from '@/lib/database';
import { sendRenewalReminder } from '@/lib/email';

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

    // Check if user is admin or super_admin
    const { data: userData } = await supabase
      .from('members')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!userData) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    // Get days until expiry from request body
    const { daysUntilExpiry = 7, dryRun = false } = await request.json().catch(() => ({}));

    // Get members needing renewal reminders
    const members = await getMembersNeedingRenewalReminders(daysUntilExpiry);

    if (!members || members.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No members need renewal reminders',
        sent: 0,
        failed: 0,
      });
    }

    let sent = 0;
    let failed = 0;
    const errors: any[] = [];

    // Send reminders to each member
    for (const member of members) {
      if (!member.email) {
        failed++;
        continue;
      }

      try {
        if (!dryRun) {
          const renewalDate = member.renewal_date ? new Date(member.renewal_date).toLocaleDateString() : 'N/A';
          const daysLeft = member.renewal_date
            ? Math.ceil((new Date(member.renewal_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
            : 0;

          await sendRenewalReminder(member.email, member.name, renewalDate, daysLeft);
          await recordReminderSent(member.id, 'renewal');
        }
        sent++;
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
      message: `Renewal reminders processing complete`,
      sent,
      failed,
      total: members.length,
      dryRun,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Error sending renewal reminders:', error);
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

    // Get members needing reminders (dry run)
    const daysUntilExpiry = parseInt(request.nextUrl.searchParams.get('days') || '7');
    const members = await getMembersNeedingRenewalReminders(daysUntilExpiry);

    return NextResponse.json({
      success: true,
      count: members?.length || 0,
      members: members || [],
      daysUntilExpiry,
    });
  } catch (error) {
    console.error('Error fetching renewal reminder members:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
