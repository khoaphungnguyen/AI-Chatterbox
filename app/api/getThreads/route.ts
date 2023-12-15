import { NextRequest,NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt';
export async function GET(req: NextRequest, res: NextResponse ){
    const secret = process.env.NEXTAUTH_SECRET;
    const authToken = await getToken({ req, secret });
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/protected/threads`, {
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
        return NextResponse.json({data: data }, {status: 200});
    } catch (error){
        console.error('Error connecting to Go server:', error);
        return new Response("Server error", { status: 500 });
          
    }
}