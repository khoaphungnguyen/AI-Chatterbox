import  query  from '@/lib/queryApi';
import { NextRequest,NextResponse } from 'next/server'
import admin from "firebase-admin"
import { adminDb } from '@/firebaseAdmin';

export async function POST(req: NextRequest) {

  const { prompt, chatId, model, session } = await req.json();

  if (!prompt){
    return NextResponse.json({ error: "Please provide a prompt!" }, { status: 400 } )
    
  }
  if (!chatId){
    return NextResponse.json({ error: "Please provide a valid chat ID!" }, { status: 400 })
  }

  // ChatGPT Query
  const response = await query(prompt,chatId, model)

  const message:Message = {
    text: response || "Chat was unable to find an answer for that!",
    createAt: admin.firestore.Timestamp.now(),
    user: {
      _id: "ChatGPT",
      name: "ChatGPT",
      avatar: "/chatgpt-icon.png",
    },
  };

  await adminDb
  .collection('users')
  .doc(session?.user?.email)
  .collection("chats")
  .doc(chatId)
  .collection("messages")
  .add(message);

  return NextResponse.json({ answer: message.text }, { status: 200 })
}

