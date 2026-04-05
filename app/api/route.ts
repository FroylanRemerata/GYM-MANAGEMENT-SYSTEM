import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      message: 'Welcome to Astral Gym API',
      version: '1.0.0',
      endpoints: {
        status: '/api/status',
        members: '/api/members',
        classes: '/api/classes',
      },
    },
    { status: 200 }
  );
}
