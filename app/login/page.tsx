'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { authenticate, signup} from '@/app/lib/actions';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function LoginPage() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessageSignIn, signInDispatch] = useFormState(authenticate, undefined);
    const [errorMessageSignUp, signUnDispatch] = useFormState(signup, undefined);

    const { pending } = useFormStatus();

    

    const toggleForm = () => {
        setIsSignUp(!isSignUp);
        // Clear the form fields when toggling between sign in and sign up
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setFullName('');
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#0F172A] text-center">
            <div className="mb-4">
                <Image 
                    src="/RapidSec.svg" 
                    width={250}
                    height={250}
                    alt="RapidSec Logo"
                />
            </div>
            <h2 className="text-white text-4xl font-bold mb-6 tracking-wide">Welcome to SmartChat</h2>
            <div className="w-full max-w-sm">
                <form  className="bg-white/20 backdrop-blur-lg shadow-md rounded-lg px-8 pt-6 pb-8">
                    {isSignUp && (
                        <div className="mb-4">
                            <input
                                className="bg-transparent border-b-2 border-gray-200 text-white placeholder-gray-400 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
                                id="full-name"
                                type="text"
                                placeholder="Full Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>
                    )}
                    <div className="mb-4">
                        <input
                            className="bg-transparent border-b-2 border-gray-200 text-white placeholder-gray-400 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                        <input
                            className="bg-transparent border-b-2 border-gray-200 text-white placeholder-gray-400 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {isSignUp && (
                        <div className="mb-6">
                            <input
                                className="bg-transparent border-b-2 border-gray-200 text-white placeholder-gray-400 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
                                id="confirm-password"
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    )}
                    <div className="flex items-center justify-center">
                    <button
                        className= "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                        aria-disabled={pending}
                        onClick={async (e) => {
                            e.preventDefault();
                            if (isSignUp) {
                                if (password !== confirmPassword) {
                                    alert("Passwords don't match!");
                                    return;
                                }
                                const formData = new FormData();
                                formData.append('fullName', fullName);
                                formData.append('email', email);
                                formData.append('password', password);
                                signUnDispatch(formData);
                            } else {
                                const formData = new FormData();
                                formData.append('email', email);
                                formData.append('password', password);
                                signInDispatch(formData);
                            }
                        }}
                    >
                        {isSignUp ? 'Sign Up' : 'Sign In'}
                    </button>
                        <div
                        className="flex h-8 items-end space-x-1"
                        aria-live="polite"
                        aria-atomic="true"
                        >
                        {errorMessageSignUp && (
                            <>
                            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                            <p className="text-sm text-red-500">{errorMessageSignUp}</p>
                            </>
                        )}
                        {errorMessageSignIn && (
                            <>
                            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                            <p className="text-sm text-red-500">{errorMessageSignIn}</p>
                            </>
                        )}
                        </div>
                    </div>
                
                </form>
                <p className="text-gray-400 mt-4">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}{" "}
                    <button
                        onClick={toggleForm}
                        className="text-blue-500 hover:text-blue-600 transition duration-300"
                    >
                        {isSignUp ? 'Sign in' : 'Sign up'}
                    </button>
                </p>
            </div>
        </div>
    );
    
}
