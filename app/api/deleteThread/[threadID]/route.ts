import { NextRequest } from 'next/server';
import {auth} from "@/auth"
export async function DELETE(req: NextRequest) {
  const authToken = await auth();;

  // Extract the threadID from the URL. You might need to adjust this depending on your URL structure.
  const urlParts = req.nextUrl.pathname.split('/');
  const threadID = urlParts[urlParts.length - 1];

  if (!threadID) {
    return new Response("Thread ID is missing", { status: 400 });
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/protected/thread/${threadID}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authToken ? `Bearer ${authToken.accessToken}` : '',
      },
    });

    if (!response.ok) {
      throw new Error(`Error deleting thread: ${response.statusText}`);
    }
    return new Response(null, { status: 204 });
  } catch (error) {
    // Log the error message if it's an instance of Error
    if (error instanceof Error) {
      console.error('Error connecting to Go server:', error.message);
    }
    return new Response("Server error", { status: 500 });
  }
}
