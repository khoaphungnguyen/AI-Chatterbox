'use client'

import { signIn } from "next-auth/react"
import Image from 'next/image'

function Login() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center
    bg-[#0F172A]"> {/* Dark navy background that complements the logo colors */}
        <div className="mb-12"> 
            <Image 
                src="/RapidSec.svg" 
                width={400} 
                height={400}
                alt="SmartChat Logo"
            />
        </div>
        <button 
            onClick={() => signIn()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full text-xl transition duration-300 ease-in-out transform hover:-translate-y-1 active:translate-y-0 shadow-lg"
        >
            Let's Get Started
        </button>
    </div>
  )
}

export default Login;
