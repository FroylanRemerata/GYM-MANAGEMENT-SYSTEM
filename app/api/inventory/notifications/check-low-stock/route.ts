import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import type { InventoryItem } from '@/types/database';

export async function POST(request: NextRequest) {
  try {
    // Check authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Verify user is admin
    const { data: userData, error: userError } = await supabaseServer
      .from('auth.users')
      .select('raw_user_meta_data')
      .eq('id', user.id)
      .single();

    const userRole = userData?.raw_user_meta_data?.role;
    if (!['admin', 'super_admin'].includes(userRole)) {
      return NextResponse.json(
        { success: false, error: 'Only admins can check notifications' },
        { status: 403 }
      );
    }

    // Get all low stock items
    const { data: items, error: itemsError } = await supabaseServer
      .from('inventory_items')
      .select('*');

    if (itemsError) {
      throw new Error(`Failed to fetch items: ${itemsError.message}`);
    }

    const lowStockItems = (items as InventoryItem[]).filter(
      item => item.quantity <= item.reorder_level
    );

    // In a real application, you would send emails here using a service like:
    // - Resend
    // - SendGrid  
    // - AWS SES
    // - Mailgun
    // - Supabase's built-in email service

    // For now, we'll return the low stock items that would need notifications
    const adminEmail = user.email;

    // Mock email sending (in production, integrate with real email service)
    const notification = {
      admin_id: user.id,
      admin_email: adminEmail,
      low_stock_items_count: lowStockItems.length,
      low_stock_items: lowStockItems.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        reorder_level: item.reorder_level,
        shortage: item.reorder_level - item.quantity
      })),
      sent_at: new Date().toISOString(),
      status: 'prepared'
    };

    // Log the notification (for audit/history purposes)
    // You could store this in a notifications table if needed

    return NextResponse.json({
      success: true,
      data: {
        message: 'Low stock check completed',
        low_stock_items_count: lowStockItems.length,
        items: lowStockItems.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          reorder_level: item.reorder_level,
          shortage: item.reorder_level - item.quantity
        })),
        recommendation: lowStockItems.length > 0 
          ? `${lowStockItems.length} items need reordering` 
          : 'All items have sufficient stock'
      }
    });
  } catch (error) {
    console.error('Error checking low stock:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get all low stock items for dashboard at a glance
    const { data: items, error: itemsError } = await supabaseServer
      .from('inventory_items')
      .select('*');

    if (itemsError) {
      throw new Error(`Failed to fetch items: ${itemsError.message}`);
    }

    // Filter items on client side where quantity <= reorder_level
    const lowStockItems = (items as InventoryItem[])?.filter(
      item => item.quantity <= item.reorder_level
    ) || [];

    return NextResponse.json({
      success: true,
      data: {
        low_stock_count: lowStockItems.length,
        items: lowStockItems.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          reorder_level: item.reorder_level,
          shortage: item.reorder_level - item.quantity
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching low stock:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}
