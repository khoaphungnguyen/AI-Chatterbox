import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest) {

  const threadID = req.nextUrl.pathname.split('/').pop();
  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req, secret });

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/protected/chat/stream/${threadID}`, {
      headers: {
        'Accept': 'text/event-stream',
        'Authorization': token ? `Bearer ${token.accessToken}` : '',
      },
    });

    if (!response.body) {
      return new Response("Failed to connect to Go server", { status: 500 });
    }
    return new NextResponse(response.body as unknown as ReadableStream<Uint8Array>, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      }
    });
  } catch (error) {
    console.error('Error connecting to Go server:', error);
    return new Response("Server error", { status: 500 });
  }
}
