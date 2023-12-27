'use client'

import { useFormState, useFormStatus } from 'react-dom';
import { signup } from '@/app/lib/actions';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

type InputFieldProps = {
    id: string;
    type: string;
    name: string;
    placeholder: string;
    required: boolean;
    minLength: number;
}

// Component for input fields
const InputField = ({ id, type, name, placeholder, required, minLength }: InputFieldProps) => (
  <div className="mb-4">
    <input
      className="bg-transparent border-b-2 border-gray-200 text-white placeholder-gray-400 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
      id={id}
      type={type}
      name={name}
      placeholder={placeholder}
      required={required}
      minLength={minLength}
    />
  </div>
);

export default function SignUpPage() {
  const [errorMessage, dispatch] = useFormState(signup, undefined);
  const { pending } = useFormStatus();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#0F172A] text-center">
    <h2 className="text-white text-4xl font-bold mb-6 tracking-wide">
    Sign Up for <span className="text-blue-500">SmartChat</span>
    </h2>      
<div className="w-full max-w-sm">
        <form action={dispatch} className="bg-white/20 backdrop-blur-lg shadow-md rounded-lg px-8 py-5">
          <InputField id="fullName" type="text" name="fullName" placeholder="Full Name" minLength={3} required />
          <InputField id="email" type="email" name="email" placeholder="Email" minLength={3} required />
          <InputField id="password" type="password" name="password" placeholder="Enter password" required minLength={8} />
          <InputField id="confirm-password" type="password" name="confirmPassword" placeholder="Confirm Password" required minLength={8} />
          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
              aria-disabled={pending}
            >
              Sign Up
            </button>
          </div>
          {errorMessage && (
            <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </div>
          )}
        </form>
        <p className="text-gray-400 mt-4">
          Already have an account?{" "}
          <a href="/" className="text-blue-500 hover:text-blue-600 transition duration-300">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}