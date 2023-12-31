'use server'

import { signIn } from '../../auth';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation'
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData );
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function signup(
    prevState: string | undefined,
    formData: FormData,
  ) {
    try {
      const fullName = formData.get('fullName');
      const email = formData.get('email');
      const password = formData.get('password');
      const confirnPassword = formData.get('confirmPassword');
      if (password !== confirnPassword) {
        return 'Passwords do not match.';
      }
      const res = await fetch(`${process.env.BACKEND_URL}/auth/signup`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password }), 
      });
  
      const data = await res.json();
      if (res.ok) {
        redirect("/");
      } else {
        console.error('Sign Up Failed', data);
        // Handle errors such as email already in use
        return data.error;
      }
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials.';
          default:
            return 'Something went wrong.';
        }
      }
      throw error;
    }
  }
