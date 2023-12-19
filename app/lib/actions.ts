import { signIn } from '../auth';
import { AuthError } from 'next-auth';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
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
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password }), // Use extracted values
      });
  
      const data = await res.json();
  
      if (res.ok) {
        // Redirect or sign in the user after successful sign-up
        signIn('credentials', { email, password });
      } else {
        console.error('Sign Up Failed', data);
        // Handle errors such as email already in use
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
