import { NextRequest,NextResponse } from 'next/server'
import openai from "@/lib/chatGPT"

export async function GET(req: NextRequest, res: NextResponse ){

  const models = await openai.models.list().then((res)=> res.data)

  const modelOptions = models.map((model)=> ({
    value: model.id,
    label: model.id
  }))
  return NextResponse.json({ modelOptions})
} 
