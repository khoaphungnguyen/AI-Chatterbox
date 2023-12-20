import { NextRequest,NextResponse } from 'next/server'
export async function POST(req: NextRequest){
    
    const secret = process.env.NEXTAUTH_SECRET;
    const { authToken } = (await req.json()) ?? {}
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/protected/thread`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken ? `Bearer ${authToken.accessToken}` : '',
          },
          body: JSON.stringify({ "title": "New Chat" }),
        });

        if (!response.ok){
            throw new Error(`Error from Creating new thread: ${response.status}`)
        }

        const data = await response.json();
        return NextResponse.json({threadId: data }, {status: 200, });
    } catch (error){
        console.error('Error connecting to Go server:', error);
        return new Response("Server error", { status: 500 });
          
    }
}