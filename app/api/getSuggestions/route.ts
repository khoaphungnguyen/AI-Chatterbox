import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';
import {auth} from '../../../auth';
export async function POST(req: NextRequest) {
  const session = await auth();
  try {
    const { model } = await req.json();
    if (!model) {
      return NextResponse.json({ error: "Please provide model!" }, {status: 400,});
    }
    //console.log("session",session)

    const response = await fetch(`${process.env.BACKEND_URL}/protected/suggestions`, {
      method: 'POST',  
      headers: {
        'Content-Type': 'application/json',
        'Authorization': session ? `Bearer ${session?.accessToken}` : '',
      },
      body: JSON.stringify({"model": model}),
    });

    // Check if the response from the backend server is OK
    if (!response.ok) {
        throw new Error(`Error from get suggestions: ${response.status}`);
    }
    // Parse the response data
    const data = await response.json();
    // Return the parsed data as a JSON response
    return NextResponse.json(data , { status: 200 });

  } catch (error) {
    // Log the error and return a server error response
    console.error('Error backend server:', error);
    return new Response("Server error", { status: 500 });
  }
}