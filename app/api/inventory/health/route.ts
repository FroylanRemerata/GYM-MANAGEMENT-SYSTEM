import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Test 1: Check if inventory_items table exists and can be queried
    const { data: tableData, error: tableError } = await supabase
      .from('inventory_items')
      .select('count', { count: 'exact', head: true });

    if (tableError) {
      return NextResponse.json({
        success: false,
        error: `Table query failed: ${tableError.message}`,
        code: tableError.code
      }, { status: 400 });
    }

    // Test 2: Check current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      return NextResponse.json({
        success: false,
        error: `Auth error: ${authError.message}`
      }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      table_exists: true,
      user_authenticated: !!user,
      user_id: user?.id || 'No user',
      user_email: user?.email || 'No email'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      type: error instanceof Error ? error.constructor.name : 'Unknown'
    }, { status: 500 });
  }
}
