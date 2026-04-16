import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { recordReminderSent } from '@/lib/database';
import { sendPromotionReminder } from '@/lib/email';

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

    // Get promotion details from request body
    const { promotionTitle, promotionDetails, expiresOn, memberIds = [], allMembers = false, dryRun = false } = await request.json().catch(() => ({}));

    // Validate required parameters
    if (!promotionTitle || !promotionDetails || !expiresOn) {
      return NextResponse.json(
        { error: 'promotionTitle, promotionDetails, and expiresOn are required' },
        { status: 400 }
      );
    }

    // Get members to send promotion to
    let targetMembers;
    if (allMembers) {
      const { data: members } = await supabase
        .from('members')
        .select('id, name, email')
        .order('created_at', { ascending: true });
      targetMembers = members || [];
    } else if (memberIds.length > 0) {
      const { data: members } = await supabase
        .from('members')
        .select('id, name, email')
        .in('id', memberIds);
      targetMembers = members || [];
    } else {
      return NextResponse.json(
        { error: 'Either allMembers=true or provide memberIds array' },
        { status: 400 }
      );
    }

    if (targetMembers.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No members to send promotion to',
        sent: 0,
        failed: 0,
      });
    }

    let sent = 0;
    let failed = 0;
    const errors: any[] = [];

    // Send promotion reminders to each member
    for (const member of targetMembers) {
      if (!member.email) {
        failed++;
        continue;
      }

      try {
        if (!dryRun) {
          await sendPromotionReminder(
            member.email,
            member.name,
            promotionTitle,
            promotionDetails,
            expiresOn
          );
          await recordReminderSent(member.id, 'promotion');
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
      message: `Promotion reminders processing complete`,
      sent,
      failed,
      total: targetMembers.length,
      promotionTitle,
      expiresOn,
      dryRun,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Error sending promotion reminders:', error);
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

    // Get members that can receive promotions
    const { data: members } = await supabase
      .from('members')
      .select('id, name, email')
      .order('created_at', { ascending: true });

    return NextResponse.json({
      success: true,
      memberCount: members?.length || 0,
      members: members || [],
      message: 'List of active members who can receive promotion reminders',
    });
  } catch (error) {
    console.error('Error fetching promotion target members:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
