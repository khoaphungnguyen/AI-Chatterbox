'use client'


import Image from 'next/image';
import { useFormState, useFormStatus } from 'react-dom';
import { signup } from '@/app/lib/actions';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function SignUpPage() {
   
    const [errorMessage, dispatch] = useFormState(signup, undefined);
    const { pending } = useFormStatus();

    return (
        <div  className="h-screen flex flex-col items-center justify-center bg-[#0F172A] text-center">
            <div className="mb-4">
                <Image 
                    src="/RapidSec.svg" 
                    width={250}
                    height={250}
                    alt="RapidSec Logo"
                />
            </div>
            <h2 className="text-white text-4xl font-bold mb-6 tracking-wide">Sign Up for SmartChat</h2>
            <div className="w-full max-w-sm">
                <form  action={dispatch} className="bg-white/20 backdrop-blur-lg shadow-md rounded-lg px-8 pt-6 pb-8" >
                    <div className="mb-4">
                        <input
                            className="bg-transparent border-b-2 border-gray-200 text-white placeholder-gray-400 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
                            id="fullName"
                            type="text"
                            name="fullName"
                            placeholder="Full Name"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            className="bg-transparent border-b-2 border-gray-200 text-white placeholder-gray-400 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Email"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <input
                            className="bg-transparent border-b-2 border-gray-200 text-white placeholder-gray-400 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            required
                            minLength={8}
                        />
                    </div>
                    <div className="mb-6">
                        <input
                            className="bg-transparent border-b-2 border-gray-200 text-white placeholder-gray-400 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
                            id="confirm-password"
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            required
                            minLength={8}
                        />
                    </div>
                    <div className="flex items-center justify-center">
                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                            aria-disabled={pending}
                        >
                            Sign Up
                        </button>
                    </div>
                    <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
                        {errorMessage && (
                            <>
                            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                            <p className="text-sm text-red-500">{errorMessage}</p>
                            </>
                        )}
                    </div>
                </form>
                <p className="text-gray-400 mt-4">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-500 hover:text-blue-600 transition duration-300">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
}
