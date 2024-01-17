"use client";

import { authenticate } from "@/app/lib/actions";
import { useFormState, useFormStatus } from "react-dom";
import { LockKeyholeIcon } from "lucide-react";
import Link from "next/link";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
export default function SignInPage() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);
  const { pending } = useFormStatus();
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
      <h2 className="text-black text-5xl font-bold mb-6 ">
        Welcome to RapidGuard
      </h2>
      <div
        className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 
       bg-white p-6"
      >
        <div className="flex flex-col items-center justify-center space-y-3 text-center">
          <Link href="/">
            <LockKeyholeIcon className="h-10 w-10 text-black" />
          </Link>
          <h3 className="text-3xl font-semibold text-black">Log In</h3>
          <p className="text-sm text-gray-500">
            Use your email and password to log in
          </p>
        </div>
        <form
          action={dispatch}
          className="backdrop-blur-lg rounded-lg px-8 py-4 mt-6"
        >
          <div className="mb-4">
            <input
              className="bg-gray-200 border-b-2 border-gray-400 text-black placeholder-gray-600 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
              id="email"
              type="email"
              name="email"
              placeholder="email@example.com"
              required
            />
          </div>
          <div className="mb-6">
            <input
              className="bg-gray-200 border-b-2 border-gray-400 text-black placeholder-gray-600 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
              id="password"
              type="password"
              name="password"
              placeholder="Enter password"
              required
              minLength={6}
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 w-full rounded focus:outline-none focus:shadow-outline transition duration-300"
              disabled={pending}
            >
              Sign In
            </button>
          </div>
          {errorMessage && (
            <div
              className="flex mt-2 space-x-1"
              aria-live="polite"
              aria-atomic="true"
            >
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </div>
          )}
          <p className="text-black mt-4">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-blue-500 hover:text-blue-600 transition duration-300"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
