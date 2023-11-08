import fetchSuggestion from '@/lib/fetchSuggestion';
import { NextRequest,NextResponse } from 'next/server'
;

export async function POST(req: NextRequest) {
  const {model} = await req.json();
  if (!model){
    return NextResponse.json({ error: "Please provide model!" }, { status: 400 } )
  }
  const response = await fetchSuggestion(model)
  

  return NextResponse.json({ answer: response}, { status: 200 })
}

