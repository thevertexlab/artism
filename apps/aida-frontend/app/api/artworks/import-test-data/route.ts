import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 在生产环境中模拟导入成功
    return NextResponse.json({
      message: 'Test data imported successfully (simulated)',
      count: 2,
      status: 'success'
    });
  } catch (error) {
    console.error('Error importing test data:', error);
    return NextResponse.json(
      { error: 'Failed to import test data' },
      { status: 500 }
    );
  }
} 