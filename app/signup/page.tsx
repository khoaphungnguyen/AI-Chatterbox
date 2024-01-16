"use client";

import { useFormState, useFormStatus } from "react-dom";
import { signup } from "@/app/lib/actions";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { UserPlusIcon } from "lucide-react";
import Link from "next/link";
type InputFieldProps = {
  id: string;
  type: string;
  name: string;
  placeholder: string;
  required: boolean;
  minLength: number;
};

// Component for input fields
const InputField = ({
  id,
  type,
  name,
  placeholder,
  required,
  minLength,
}: InputFieldProps) => (
  <div className="mb-4">
    <input
      className="bg-transparent border-b-2 border-gray-200 placeholder-gray-400 w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
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
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 shadow-xl bg-white">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-300 px-4 py-6 pt-8 text-center sm:px-16">
          <Link href="/">
            <UserPlusIcon className="h-10 w-10 text-blue-500" />
          </Link>
          <h3 className="text-2xl font-semibold text-gray-700">Register</h3>
          <p className="text-sm text-gray-500">
            Create an account with your full name, email, and password
          </p>
        </div>

        <form
          action={dispatch}
          className="bg-white shadow-md rounded-lg px-8 py-5"
        >
          <InputField
            id="fullName"
            type="text"
            name="fullName"
            placeholder="Full Name"
            minLength={3}
            required
          />
          <InputField
            id="email"
            type="email"
            name="email"
            placeholder="Email"
            minLength={3}
            required
          />
          <InputField
            id="password"
            type="password"
            name="password"
            placeholder="Enter password"
            required
            minLength={8}
          />
          <InputField
            id="confirm-password"
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            minLength={8}
          />
          <div className="flex items-center justify-center mt-4">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold w-full py-2  rounded focus:outline-none focus:shadow-outline transition duration-300"
              aria-disabled={pending}
            >
              Sign Up
            </button>
          </div>
          {errorMessage && (
            <div
              className="flex h-8 items-end space-x-1 mt-2"
              aria-live="polite"
              aria-atomic="true"
            >
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </div>
          )}
          <p className="text-gray-600 mt-4 text-center">
            Already have an account?{" "}
            <Link
              href="/"
              className="text-blue-500 hover:text-blue-600 transition duration-300"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
