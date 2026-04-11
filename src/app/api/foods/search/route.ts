import { NextRequest, NextResponse } from 'next/server';
import { searchUSDA } from '@/lib/foodProviders/usda';
import { searchMock } from '@/lib/foodProviders/mock';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q');
  if (!q || q.trim().length < 2) {
    return NextResponse.json({ foods: [], source: 'none' });
  }

  const apiKey = process.env.USDA_API_KEY;

  // Try USDA first
  if (apiKey) {
    try {
      const foods = await searchUSDA(q, apiKey, 15);
      if (foods.length > 0) {
        return NextResponse.json({ foods, source: 'usda' });
      }
    } catch (err) {
      console.error('USDA API error, falling back to mock:', err);
    }
  }

  // Fallback to mock
  const mockResults = searchMock(q);
  return NextResponse.json({ foods: mockResults, source: 'mock' });
}
