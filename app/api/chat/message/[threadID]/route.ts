// pages/api/chat/message/[threadID].ts
import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';

export async function POST(req: NextRequest) {
  // Extract the threadID from the URL
  const threadID = req.nextUrl.pathname.split('/').pop();

  // Extract the token from the request headers
  const token = req.headers.get('authorization')?.split(' ')[1]; // Assumes "Bearer <token>"

  // Construct the Go server URL
  const goServerUrl = `http://localhost:8000/protected/chat/post/${threadID}`;

  // Forward the request to the Go backend
  const backendResponse = await fetch(goServerUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Pass the token in the Authorization header
      'Authorization': token ? `Bearer ${token}` : '',
    },
    body: await req.text(),
  });

  // Forward the backend response status and body to the client
  if (!backendResponse.ok) {
    // Handle errors, such as by returning the status code and message from the backend
    const errorData = await backendResponse.text();
    return new Response(errorData, {
      status: backendResponse.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const data = await backendResponse.text();
  return new Response(data, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}