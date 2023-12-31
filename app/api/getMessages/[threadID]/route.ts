import { NextRequest,NextResponse } from 'next/server'
import {auth} from  "@/auth"
export async function GET(req: NextRequest){
    const session = await auth();
    const threadID = req.nextUrl.pathname.split('/').pop();
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/protected/threads/${threadID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': session ? `Bearer ${session.accessToken}` : '',
          },
        });

        if (!response.ok){
            throw new Error(`Error from getting message: ${response.status}`)
        }

        const data = await response.json();
        return NextResponse.json(data , {status: 200});
    } catch (error){
        console.error('Error retrival from the backend server:', error);
        return new Response("Server error", { status: 500 });
          
    }
}