import { NextResponse } from 'next/server';
import { logAttendance, getAttendanceByMember, updateAttendance, deleteAttendance } from '@/lib/database';

// GET attendance records
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('memberId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!memberId) {
      return NextResponse.json(
        { success: false, error: 'Member ID is required' },
        { status: 400 }
      );
    }

    const attendance = await getAttendanceByMember(memberId, startDate || undefined, endDate || undefined);
    return NextResponse.json({ success: true, data: attendance });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch attendance' },
      { status: 400 }
    );
  }
}

// POST log check-in
export async function POST(request: Request) {
  try {
    const { memberId } = await request.json();

    if (!memberId) {
      return NextResponse.json(
        { success: false, error: 'Member ID is required' },
        { status: 400 }
      );
    }

    const attendance = await logAttendance(memberId);
    return NextResponse.json({ success: true, data: attendance }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to log attendance' },
      { status: 400 }
    );
  }
}

// PUT update attendance
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Attendance ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const attendance = await updateAttendance(id, body);
    return NextResponse.json({ success: true, data: attendance });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to update attendance' },
      { status: 400 }
    );
  }
}

// DELETE attendance record
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Attendance ID is required' },
        { status: 400 }
      );
    }

    await deleteAttendance(id);
    return NextResponse.json({ success: true, message: 'Attendance record deleted' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to delete attendance' },
      { status: 400 }
    );
  }
}
