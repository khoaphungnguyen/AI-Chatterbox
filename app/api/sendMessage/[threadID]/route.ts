import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
  // Extract the threadID from the URL
  const threadID = req.nextUrl.pathname.split('/').pop();

  const authToken = await auth();


  try {
    // Forward the request to the backend server
    const response = await fetch(`${process.env.BACKEND_URL}/protected/chat/ask/${threadID}`, {
      method: 'POST',  
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authToken ? `Bearer ${authToken.accessToken}` : '',
      },
      body: await req.text(),
    });

    // Check if the response from the backend server is OK
    if (!response.ok) {
        throw new Error(`Error from submitting a question: ${response.status}`);
    }

    // Parse the response data
    const data = await response.json();

    // Return the parsed data as a JSON response
    return NextResponse.json({ data: data }, { status: 200 });

  } catch (error) {
    // Log the error and return a server error response
    console.error('Error connecting to Go server:', error);
    return new Response("Server error", { status: 500 });
  }
}
