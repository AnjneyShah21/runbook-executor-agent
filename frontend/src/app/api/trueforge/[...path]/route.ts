import { NextRequest, NextResponse } from 'next/server';

const TRUEFORGE_API_URL = process.env.TRUEFORGE_API_URL || 'http://localhost:3000/api/v1';
const TRUEFORGE_API_KEY = process.env.TRUEFORGE_API_KEY || 'tf_sk_runbook_executor_hackathon_2026_demo_key';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const subpath = resolvedParams.path ? resolvedParams.path.join('/') : '';
    const targetUrl = `${TRUEFORGE_API_URL}/${subpath}${req.nextUrl.search}`;

    const res = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'x-api-key': TRUEFORGE_API_KEY,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'TrueForge backend server unreachable',
        details: error.message,
      },
      { status: 503 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const subpath = resolvedParams.path ? resolvedParams.path.join('/') : '';
    const targetUrl = `${TRUEFORGE_API_URL}/${subpath}`;
    const body = await req.json();

    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'x-api-key': TRUEFORGE_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'TrueForge backend server unreachable',
        details: error.message,
      },
      { status: 503 }
    );
  }
}
