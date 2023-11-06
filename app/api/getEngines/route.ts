import  query  from '@/lib/queryApi';
import { NextRequest,NextResponse } from 'next/server'
import openai from "@/lib/chatGPT"

type Option = {
    value: string;
    label: string;
}

type Data = {
    modelOptions: Option[];
}


export async function GET(req: NextRequest, res: NextResponse ){

  const models = await openai.models.list().then((res)=> res.data)

  const modelOptions = models.map((model)=> ({
    value: model.id,
    label: model.id
  }))
  return NextResponse.json({ modelOptions})
} 
