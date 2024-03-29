"use client";

import Image from "next/image";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { authenticate } from "@/app/lib/actions";
import { useFormState, useFormStatus } from "react-dom";
import icon from "@/public/icon.svg";

export default function SignInPage() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);
  const { pending } = useFormStatus();
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#0F172A] text-center">
      <Image src={icon} width={420} height={420} alt="RapidGuard Logo" />
      <h2 className="text-white text-4xl font-bold mb-6 ">
        Welcome to RapidGuard.io
      </h2>
      <div className="w-full max-w-sm ">
        <form
          action={dispatch}
          className="bg-gray-800 backdrop-blur-lg shadow-md rounded-lg px-8 py-8"
        >
          <div className="mb-4">
            <input
              className="bg-transparent border-b-2 border-gray-200 text-white placeholder-gray-400
w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
              id="email"
              type="email"
              name="email"
              placeholder="Enter email"
              required
            />
          </div>
          <div className="mb-6">
            <input
              className="bg-transparent border-b-2 border-gray-200 text-white placeholder-gray-400
w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
              id="password"
              type="password"
              name="password"
              placeholder="Enter password"
              required
              minLength={6}
            />
          </div>
          <div className="flex items-center justify-center ">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 w-full rounded focu
s:outline-none focus:shadow-outline transition duration-300"
              aria-disabled={pending}
            >
              Sign In
            </button>
          </div>
          {errorMessage && (
            <div
              className="flex mt-2   space-x-1"
              aria-live="polite"
              aria-atomic="true"
            >
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </div>
          )}
        </form>
        <p className="text-gray-400 mt-4">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-blue-500 hover:text-blue-600 transition duration-300"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
