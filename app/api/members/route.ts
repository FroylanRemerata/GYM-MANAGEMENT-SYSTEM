import { NextResponse } from 'next/server';
import { getMembers, getMemberById, createMember, updateMember, deleteMember } from '@/lib/database';

// GET all members or specific member
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const member = await getMemberById(id);
      return NextResponse.json({ success: true, data: member });
    }

    const members = await getMembers();
    return NextResponse.json({ success: true, data: members });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch members' },
      { status: 400 }
    );
  }
}

// POST create new member
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const member = await createMember(body);
    return NextResponse.json({ success: true, data: member }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to create member' },
      { status: 400 }
    );
  }
}

// PUT update member
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Member ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const member = await updateMember(id, body);
    return NextResponse.json({ success: true, data: member });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to update member' },
      { status: 400 }
    );
  }
}

// DELETE member
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Member ID is required' },
        { status: 400 }
      );
    }

    // Permission check: Only super_admin can delete members
    // Note: In production, validate the JWT token and role from the request
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Authentication required' },
        { status: 401 }
      );
    }

    // TODO: Validate that user has super_admin role
    // For now, we allow deletion if authenticated
    // In production: decode JWT, check role === 'super_admin'

    await deleteMember(id);
    return NextResponse.json({ success: true, message: 'Member deleted' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to delete member' },
      { status: 400 }
    );
  }
}
