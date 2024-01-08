import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
  // Extract the threadID from the URL
  const threadID = req.nextUrl.pathname.split('/').pop();

  const authToken = await auth();

  const body = await req.json();

  const messages = body.messages;
  const model = body.model;
  const stop = body.stopStreaming;

  try {
    // Forward the request to the backend server
    if (stop) {
      const response = await fetch(`${process.env.BACKEND_URL}/protected/chat/ask/${threadID}?stop=true`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken ? `Bearer ${authToken.accessToken}` : '',
        },
      });
    
      if (!response.ok) {
        throw new Error(`Error stop streaming: ${response.statusText}`);
      }
    
       // Parse the response data
    const data = await response.json();
    // Return the parsed data as a JSON response
    return NextResponse.json({ data: data }, { status: 200 });

    } else {
    const response = await fetch(`${process.env.BACKEND_URL}/protected/chat/ask/${threadID}`, {
      method: 'POST',  
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authToken ? `Bearer ${authToken.accessToken}` : '',
      },
      body: JSON.stringify({ messages: messages, model: model }),
    });

    // Check if the response from the backend server is OK
    if (!response.ok) {
        throw new Error(`Error from submitting a question: ${response.status}`);
    }

    // Parse the response data
    const data = await response.json();
    // Return the parsed data as a JSON response
    return NextResponse.json({ data: data }, { status: 200 });
  }
  } catch (error) {
    // Log the error and return a server error response
    console.error('Error backend server:', error);
    return new Response("Server error", { status: 500 });
  }
}
