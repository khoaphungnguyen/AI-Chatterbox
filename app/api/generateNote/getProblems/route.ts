import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';
import {auth} from '../../../../auth';
export async function POST(req: NextRequest) {
  const session = await auth();


  const body = await req.json();

  const input = body.input;
  const systemPromt  = "From the title, generate a unique and concise coding problem. The problem should be clearly explained and solvable within 30 minutes in any programming language. Include follow-up questions and requirements.";
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/protected/hints`, {
      method: 'POST',  
      headers: {
        'Content-Type': 'application/json',
        'Authorization': session ? `Bearer ${session?.accessToken}` : '',
      },
      body: JSON.stringify({"model": "gpt-3.5-turbo-0125",
       //body: JSON.stringify({"model": "llama2:13b",
      "input": input,
    "system":systemPromt}),
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