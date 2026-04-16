import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Default system settings
const DEFAULT_SETTINGS = {
  gymName: 'Astral Gym',
  gymEmail: 'info@astralgym.com',
  gymPhone: '+63 2 1234 5678',
  address: 'Manila, Philippines',
  timezone: 'Asia/Manila',
  currency: 'PHP',
  maintenanceMode: false,
  twoFactorEnabled: false,
  emailNotifications: true,
  smsNotifications: false,
  dataBackupEnabled: true,
  backupFrequency: 'weekly',
};

export async function GET() {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Try to fetch settings from a settings table, otherwise return defaults
    const { data: settings } = await supabase
      .from('system_settings')
      .select('*')
      .limit(1)
      .single();

    return NextResponse.json({
      settings: settings || DEFAULT_SETTINGS,
    });
  } catch (error: any) {
    // If table doesn't exist or query fails, return defaults
    return NextResponse.json({
      settings: DEFAULT_SETTINGS,
    });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();

    // Upsert settings (create or update)
    const { data: result, error } = await supabase
      .from('system_settings')
      .upsert(
        { id: 1, ...updates, updated_at: new Date().toISOString() },
        { onConflict: 'id' }
      )
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      message: 'Settings updated successfully',
      settings: result,
    });
  } catch (error: any) {
    console.error('Settings update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
