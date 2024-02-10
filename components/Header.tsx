"use client";

import ModelButton from "./ModelButton";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const Header: React.FC = () => {
  const { data: model, mutate: setModel } = useSWR("model", {
    fallbackData: "gpt-3.5-turbo-0125",
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
    <header className="w-full px-4 py-2 md:py-4 lg:py-6 sticky top-0 bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row lg:flex-row justify-between items-center">
        <div className="text-center md:text-left lg:text-left py-2 md:py-0 lg:py-0 flex items-center justify-center md:justify-start lg:justify-start">
          <div className="flex space-x-2 md:space-x-4 lg:space-x-6">
            <ul className="flex p-2 space-x-2 md:space-x-4 lg:space-x-6 text-sm md:text-base lg:text-lg font-semibold text-white">
              <li className="hover:text-blue-600">
                <Link href="/">Home</Link>
              </li>
              <li className="hover:text-blue-600">
                <Link href="notes">Note</Link>
              </li>
              <li className="hover:text-blue-600">
                <Link href="/draw">Draw</Link>
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
        <div className="flex gap-2 md:gap-4 g:gap-6">
          <ModelButton
            label="Default"
            icon="fire"
            isActive={model === "gpt-3.5-turbo-0125"}
            onClick={() => handleClick("gpt-3.5-turbo-0125")}
          />
          <ModelButton
            label="Fast"
            icon="bolt"
            isActive={model === "llama2:13b"}
            onClick={() => handleClick("llama2:13b")}
          />
          <ModelButton
            label="Code"
            icon="code"
            isActive={model === "codellama:13b"}
            onClick={() => handleClick("codellama:13b")}
          />
          <ModelButton
            label="GPT 4"
            icon="sparkles"
            isActive={model === "gpt-4-0125-preview"}
            onClick={() => handleClick("gpt-4-0125-preview")}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
