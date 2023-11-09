import fetchSuggestion from '@/lib/fetchSuggestion';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { model } = await req.json();
    if (!model) {
      return NextResponse.json({ error: "Please provide model!" }, {status: 400,});
    }

    const response = await fetchSuggestion(model);
    
    return NextResponse.json({answer: response }, {status: 200, });

  } catch (error) {
    // Log the error for server-side debugging
    console.error(error);

    return NextResponse.json({ error: 'An error occurred while fetching suggestions' }, {status: 500});
  }
}