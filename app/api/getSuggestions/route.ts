import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';
import {auth} from '../../../auth';
import suggestions from '@/components/suggestion.json';
export async function POST() {
  const session = await auth();
  if (!session) {
    return NextResponse.redirect('/login');
  }

 // Generate 4 unique random indices
const indices = new Set<number>();
while (indices.size < 4) {
  indices.add(Math.floor(Math.random() * suggestions.length));
}

// Use the indices to pick items from the suggestions array
const randomSuggestions = Array.from(indices).map(index => suggestions[index]);


if (randomSuggestions){
  return NextResponse.json(randomSuggestions , { status: 200 });

}

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/protected/suggestions`, {
      method: 'POST',  
      headers: {
        'Content-Type': 'application/json',
        'Authorization': session ? `Bearer ${session?.accessToken}` : '',
      },
      body: JSON.stringify({"model": "gpt-3.5-turbo-1106"}),
    });

    // Check if the response from the backend server is OK
    if (!response.ok) {
        throw new Error(`Error from get suggestions: ${response.status}`);
    }
    // Parse the response data
    const data = await response.json();
    // Return the parsed data as a JSON response

    console.log("data2: ",data);


    return NextResponse.json(data , { status: 200 });

  } catch (error) {
    // Log the error and return a server error response
    console.error('Error backend server:', error);
    return new Response("Server error", { status: 500 });
  }
}