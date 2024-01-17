import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest ){

    try {
        const data = await req.json(); // Parse the request body
        // Perform the signup operation
        const response = await fetch(`${process.env.BACKEND_URL}/auth/signup`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Error in signup process');
        }
        const result = await response.json();
        return NextResponse.json(result, {status: 200, });
    } catch (error) {
        console.error(error);
        return new Response("Server error", { status: 500 });
    }
}