import { NextResponse } from 'next/server';
import { MOCK_ARTISTS } from '@/src/data/mockData';

export async function GET() {
  try {
    // 在生产环境中返回静态数据
    return NextResponse.json(MOCK_ARTISTS);
  } catch (error) {
    console.error('Error fetching artists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artists' },
      { status: 500 }
    );
  }
} 