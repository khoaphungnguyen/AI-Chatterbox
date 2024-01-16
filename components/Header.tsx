"use client";

import ModelButton from "./ModelButton";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const Header: React.FC = () => {
  const { data: model, mutate: setModel } = useSWR("model", {
    fallbackData: "gpt-3.5-turbo-1106",
  });
  const { data: session } = useSession();
  const router = useRouter(); // Initialize useRouter
  const pathname = usePathname();

  const handleClick = (modelName: string) => {
    if (session && session.error) {
      router.push(`/api/auth/signin?callbackUrl=${pathname}`);
      console.log("Refresh token is invalid");
      return;
    }
    setModel(modelName);
  };

  return (
    <header className="w-full px-4 py-4 sticky top-0 bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left py-8 md:py-0 hidden md:flex items-center">
          <div className="flex space-x-20">
            <ul className="flex p-2 space-x-2 text-lg  font-semibold text-white">
            <li className="hover:text-blue-600">
                <Link href="/">Home</Link>
              </li>
              <li className="hover:text-blue-600">
                <Link href="todolist">TodoList</Link>
              </li>
              <li className="hover:text-blue-600">
                <Link href="/draw">AI-Draw</Link>
              </li>
              <li className="hover:text-blue-600">
                <Link href="/">Blog</Link>
              </li>
              <li className="hover:text-blue-600">
                <Link href="/">Features</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex gap-4">
          <ModelButton
            label="Default"
            icon="fire"
            isActive={model === "gpt-3.5-turbo-1106"}
            onClick={() => handleClick("gpt-3.5-turbo-1106")}
          />
          <ModelButton
            label="Fast"
            icon="bolt"
            isActive={model === "openhermes"}
            onClick={() => handleClick("openhermes")}
          />
          <ModelButton
            label="Code"
            icon="code"
            isActive={model === "codellama"}
            onClick={() => handleClick("codellama")}
          />
          <ModelButton
            label="GPT 4"
            icon="sparkles"
            isActive={model === "gpt-4-1106-preview"}
            onClick={() => handleClick("gpt-4-1106-preview")}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
