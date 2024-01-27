import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth';

export async function POST(req: NextRequest){
    const authToken = await auth();
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/protected/notes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken ? `Bearer ${authToken.accessToken}` : '',
          },
          body: JSON.stringify(await req.json()),
        });

        if (!response.ok){
            throw new Error(`Error from Creating new thread: ${response.status}`)
        }

        const data = await response.json(); 
        return NextResponse.json(data , {status: 200, });
    } catch (error){
        console.error('Error backend server:', error);
        return new Response("Server error", { status: 500 });
          
    }
}

export async function GET(req: NextRequest){
  const authToken = await auth();
  try {
      const response = await fetch(`${process.env.BACKEND_URL}/protected/notes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken ? `Bearer ${authToken.accessToken}` : '',
        },
      });

      if (!response.ok){
          throw new Error(`Error from Creating new thread: ${response.status}`)
      }

      const data = await response.json();
      return NextResponse.json(data, {status: 200, });
  } catch (error){
      console.error('Error backend server:', error);
      return new Response("Server error", { status: 500 });
        
  }
}