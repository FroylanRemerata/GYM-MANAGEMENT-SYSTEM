import { NextResponse } from 'next/server';
import { getDashboardStats } from '@/lib/database';

export async function GET() {
  try {
    const stats = await getDashboardStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch stats' },
      { status: 400 }
    );
  }
}
