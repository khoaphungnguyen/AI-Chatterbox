'use client'

import ModelButton from "./ModelButton";
import useSWR from 'swr';
import {useSession} from 'next-auth/react';
import { useRouter, usePathname } from "next/navigation"; 


const Header: React.FC = () => {
  const { data: model, mutate: setModel } = useSWR('model', {
    fallbackData: 'default' // Set the default or fallback model
  });
  const { data: session } = useSession();
  const router = useRouter(); // Initialize useRouter
  const pathname = usePathname();

  const handleClick = (modelName: string) => {
    if (session && session.error) {
      router.push(`/api/auth/signin?callbackUrl=${pathname}`);
      console.log("Refresh token is invalid")
      return
    }
    setModel(modelName);
  };

  return (
    <header className="w-full px-4 py-4 sticky top-0 bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left py-8 md:py-0">
          <h1 className="text-2xl md:text-3xl font-semibold relative inline-block">
            Smart
            <span className="absolute top-2 transform translate-x-full 
            -translate-y-full bg-yellow-500 text-yellow-900 px-2 py-1 
            rounded-full text-sm md:text-base font-semibold animate-bounce">
              Chat
            </span>
          </h1>
        </div>
        <div className="flex gap-4">
         <ModelButton 
            label="Default" 
            icon="fire" 
            isActive={model === 'default'} 
            onClick={() => handleClick('default')}
          />
          <ModelButton 
            label="GPT 4" 
            icon="sparkles" 
            isActive={model === 'gpt-4-1106-preview'} 
            onClick={() => handleClick('gpt-4-1106-preview')}
          />
           <ModelButton 
            label="GPT 3.5" 
            icon="bolt" 
            isActive={model === 'gpt-3.5-turbo-1106'} 
            onClick={() => handleClick('gpt-3.5-turbo-1106')}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;