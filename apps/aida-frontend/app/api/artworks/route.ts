import { NextResponse } from 'next/server';
import { MOCK_ARTWORKS } from '@/src/data/mockData';

export async function GET() {
  try {
    // 在生产环境中返回静态数据
    return NextResponse.json(MOCK_ARTWORKS);
  } catch (error) {
    console.error('Error fetching artworks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artworks' },
      { status: 500 }
    );
  }
} 