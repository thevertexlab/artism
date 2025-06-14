import { NextRequest, NextResponse } from 'next/server';
import { MOCK_AI_RESPONSES, MOCK_ARTISTS } from '@/src/data/mockData';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, artist_id } = body;

    // 根据艺术家 ID 找到对应的艺术家
    const artist = MOCK_ARTISTS.find(a => a.id === artist_id);
    if (!artist) {
      return NextResponse.json(
        { error: 'Artist not found' },
        { status: 404 }
      );
    }

    // 获取该艺术家的模拟响应
    const responses = MOCK_AI_RESPONSES[artist.name as keyof typeof MOCK_AI_RESPONSES];
    if (!responses) {
      return NextResponse.json(
        { error: 'AI responses not available for this artist' },
        { status: 404 }
      );
    }

    // 随机选择一个响应
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    return NextResponse.json({
      response: randomResponse,
      artist_name: artist.name,
      artist_id: artist_id,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in AI interaction:', error);
    return NextResponse.json(
      { error: 'Failed to process AI interaction' },
      { status: 500 }
    );
  }
} 