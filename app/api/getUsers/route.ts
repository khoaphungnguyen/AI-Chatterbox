import { NextRequest,NextResponse } from 'next/server'
import { auth } from '@/auth';
export async function GET(){
      const authToken = await auth();
      const user = authToken?.user;

      if (user?.role !== 'admin'){
          return new Response("Unauthorized", { status: 401 });
      }
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/protected/users`, {
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
        console.error('Error backend server:', error);
        return new Response("Server error", { status: 500 });
          
    }
}