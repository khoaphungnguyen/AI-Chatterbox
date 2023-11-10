import  query  from '@/lib/queryApi';
import { NextRequest,NextResponse } from 'next/server'
import admin from "firebase-admin"
import { adminDb } from '@/firebaseAdmin';

export async function POST(req: NextRequest) {
  const { messages, chatId, model, session } = await req.json();
  if (!messages){
    return NextResponse.json({ error: "Please provide messages!" }, { status: 400 } )
  }
  if (!chatId){
    return NextResponse.json({ error: "Please provide a valid chat ID!" }, { status: 400 })
  }

  // ChatGPT Query
  const response = await query(messages, model)

  const message:Message = {
    "content": response || "Chat was unable to find an answer for that!",
    "createAt": admin.firestore.Timestamp.now(),
    "user": {
      "_id": "SmartChat",
      "name": "SmartChat",
      "avatar": "/icon.png",
      "role":"assistant"
    },
  };

  await adminDb
  .collection('users')
  .doc(session?.user?.email)
  .collection("chats")
  .doc(chatId)
  .collection("messages")
  .add(message);

  return NextResponse.json({ answer: message.content}, { status: 200 })
}

