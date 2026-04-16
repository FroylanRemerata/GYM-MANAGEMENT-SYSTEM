import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getLowStockItems } from '@/lib/database';
import { sendLowStockAlert } from '@/lib/email';

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

    // Get staff emails from request body
    const { staffEmails = [], threshold = 50, dryRun = false } = await request.json().catch(() => ({}));

    if (!staffEmails || staffEmails.length === 0) {
      return NextResponse.json(
        { error: 'At least one staff email is required' },
        { status: 400 }
      );
    }

    // Get low stock items
    const items = await getLowStockItems(threshold);

    if (!items || items.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No low stock items',
        sent: 0,
        failed: 0,
      });
    }

    let sent = 0;
    let failed = 0;
    const errors: any[] = [];

    // Send alerts to each staff member
    for (const staffEmail of staffEmails) {
      for (const item of items) {
        try {
          if (!dryRun) {
            await sendLowStockAlert(
              staffEmail,
              item.name,
              item.quantity,
              item.reorder_level,
              item.supplier
            );
          }
          sent++;
        } catch (error) {
          failed++;
          errors.push({
            itemId: item.id,
            itemName: item.name,
            staffEmail,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Low stock alerts processed`,
      sent,
      failed,
      total: items.length * staffEmails.length,
      itemsCount: items.length,
      staffCount: staffEmails.length,
      dryRun,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Error sending low stock alerts:', error);
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

    const threshold = parseInt(request.nextUrl.searchParams.get('threshold') || '50');
    const items = await getLowStockItems(threshold);

    return NextResponse.json({
      success: true,
      count: items?.length || 0,
      items: items || [],
      threshold,
    });
  } catch (error) {
    console.error('Error fetching low stock items:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
