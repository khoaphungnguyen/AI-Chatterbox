import { NextRequest,NextResponse } from 'next/server'
import { auth } from '@/auth';

export async function DELETE(req: NextRequest){
  const authToken = await auth();
   // Extract the noteID from the URL
   const noteID = req.nextUrl.pathname.split('/').pop();
 
  try {
      const response = await fetch(`${process.env.BACKEND_URL}/protected/notes/${noteID}`, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': authToken ? `Bearer ${authToken.accessToken}` : '',
      },
    });

      if (!response.ok) {
        throw new Error(`Error deleting NoteID: ${response.statusText}`);
      }
      return new Response(null, { status: 204 });
    } catch (error) {
      // Log the error message if it's an instance of Error
      if (error instanceof Error) {
        console.error('Error backend server:', error.message);
      }
      return new Response("Server error", { status: 500 });
  }
}

export async function PUT(req: NextRequest){
  // Extract the noteID from the URL
  const noteID = req.nextUrl.pathname.split('/').pop();
  const body = await req.json();
  const problem = body.problem;
  const approach = body.approach;
  const solution = body.solution;
  const extraNote = body.extraNote;

  const authToken = await auth();
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/protected/notes/${noteID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken ? `Bearer ${authToken.accessToken}` : '',
        },
        body: JSON.stringify({
          problem,
          approach,
          solution,
          extra_note: extraNote,
        }),
      });

      if (!response.ok){
          throw new Error(`Error from Creating new thread: ${response.status}`)
      }

      const data = await response.json();
      return NextResponse.json({threadId: data }, {status: 200, });
  } catch (error){
      console.error('Error backend server:', error);
      return new Response("Server error", { status: 500 });
        
  }
}

export async function GET(req: NextRequest){
  const authToken = await auth();
  const noteID = req.nextUrl.pathname.split('/').pop();
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/protected/notes/${noteID}`, {
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

      return NextResponse.json(data, {status: 200});
  } catch (error){
      console.error('Error backend server:', error);
      return new Response("Server error", { status: 500 });
        
  }
}
