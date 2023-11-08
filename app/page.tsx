'use client'
import { BoltIcon, PaperAirplaneIcon, SparklesIcon } from "@heroicons/react/20/solid";
import { useState, useEffect } from 'react';
import useSWR from "swr";
import { useSession } from 'next-auth/react';
import { collection, serverTimestamp, addDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useRouter } from "next/navigation"; 
import  query  from '@/lib/queryApi';
import toast from 'react-hot-toast';

export default function Home() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const { data: session } = useSession();
  const { data: model} = useSWR('model',{
    fallbackData: 'gpt-3.5-turbo-0613'
  })
    // State to store the suggestions
    const [suggestions, setSuggestions] = useState([]);
  
    // Function to fetch suggestions from an API
    const fetchSuggestions = async () => {
      try {
        const messages = [
          {
            "role": 'user',
            "content": "Give me a brief recommendation of no more than 20 words on a random topic that could intrigue and engage users."
          }
        ];
        const message = await query(messages, model);
        setSuggestions(prevSuggestions => [...prevSuggestions, message]); // Update the state with the fetched suggestion
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };
    
    // Invoke fetchSuggestions inside a useEffect hook to load suggestions when the component mounts
    useEffect(() => {
      fetchSuggestions();
    }, []);

  const createNewChat = async(event:React.MouseEvent<HTMLButtonElement, MouseEvent>) =>{
    event.preventDefault();
    if (!prompt.trim()) return;

    const input = prompt.trim();
    setPrompt("");

    // Ensure the user is authenticated before trying to access their email
    if (!session || !session.user || !session.user.email) {
      toast.error("You need to be logged in.");
      return;
    }
    try {
      const chatDocRef = await addDoc(collection(db, "users", session.user.email, 'chats'), {
        userId: session.user.email,
        createdAt: serverTimestamp(),
      });

      const message = {
        content: prompt,
        createdAt: serverTimestamp(),
        user: {
          _id: session.user.email,
          name: session.user.name,
          avatar: session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}`,
          role: "user",
        },
      };

      await addDoc(collection(db, "users", session.user.email, "chats", chatDocRef.id, 'messages'), message);
      const notification = toast.loading("ChatGPT is thinking...");

      const response = await fetch('/api/askQuestions', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          chatId: chatDocRef.id,
          model,
          session,
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok.');

      toast.success("ChatGPT has responded", {
        id: notification,
      });

      router.push(`/chat/${chatDocRef.id}`);
    } catch (error) {
      console.error("Failed to create new chat:", error);
      toast.error("There was an issue starting the chat.");
    }

    setPrompt("");
};
  return (
    <div className="flex h-full flex-col items-center justify-between pb-64">
       {/* Model selection bar */}
      <div className="w-full px-2 py-2 sticky top-0 md:py-6">
        <div className="flex flex-col items-stretch justify-center gap-2 relative sm:items-center">
          <div className="flex rounded-xl bg-gray-900 p-1 text-gray-900">
             {/* Model Buttons */}
            <ul className="flex list-none gap-1 w-full sm:w-auto">
              <li className="group w-full">
                <button
                  className="w-full cursor-ponter"
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded="false"
                >
                  <div
                    className= {`relative flex w-full items-center justify-center gap-1 rounded-lg border py-3 
                    outline-none transition-opacity duration-100 sm:w-auto sm:min-w-[148px] text-gray-500 md:gap-2 md:py-2.5 border-black/10 shadow-[0_1px_7px_0px_rgba(0,0,0,0.06)]
                     group-hover:!opacity-100 border-[#4E4F60]group-hover:bg-gray-700 group-hover:text-gray-100
                     ${model.includes("3") ? "opacity-100 bg-gray-700 text-gray-100" :"" }`}
                  >
                    <span className="max-[370px]:hidden relative"></span>
                    <span className="truncate text-sm font-meidum md:pr-1.5 pr-1.5">
                      GPT 3.5
                    </span>
                    <span>
                    <BoltIcon className={`w-5 h-5 group-hover:text-[#19C37D] ${model.includes("3") ? 'text-[#19C37D]' : ''}`} />

                    </span>
                  </div>
                </button>
              </li>
              <li className="group w-full">
                <button
                  className="w-full cursor-ponter"
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded="false"
                >
                  <div
                    className={`relative flex w-full items-center justify-center gap-1 rounded-lg border py-3 
                    outline-none transition-opacity duration-100 sm:w-auto sm:min-w-[148px] md:gap-2 md:py-2.5
                     border-black/10 shadow-[0_1px_7px_0px_rgba(0,0,0,0.06)] group-hover:opacity-100 border-[#4E4F60] 
                      group-hover:bg-gray-700 text-gray-500 group-hover:text-gray-100 
                      ${model.includes("4") ? "opacity-100 bg-gray-700 text-gray-100": "" }` }
                  >
                    <span className="max-[370px]:hidden relative">
                      <SparklesIcon  className={`w-5 h-5 group-hover:text-[#A263F1] ${model.includes("4") ? 'text-[#A263F1]' : ''}`} />
                    </span>
                    <span className="truncate text-sm font-meidum md:pr-1.5 pr-1.5">
                      GPT 4
                    </span>
                  </div>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

       {/* Main title */}
      <div className="flex h-full w-full pb-2 md:pb-[8vh]">
        <h1 className="flex flex-grow items-center justify-center mb-10 text-4xl font-semibold text-center text-[#565869] sm:mb-16 ml-auto mr-auto gap-2">
          AIChat
          <span className="brounded-md bg-yellow-200 py-0.5 px-1.5 text-xs text-yellow-900 md:text-sm">
            SMART
          </span>
        </h1>
      </div>

      {/* Bottom bar with form */}
      <div
        className="absolute bottom-0 right-0 w-full pt-2 bg-[#343541] md:pt-0 md:w-[calc(100%-20rem)]"
      >
        <form className="flex flex-col gap-3 mx-2 md:mx-4 lg:mx-auto lg:max-w-2xl xl:max-w-3xl last:mb-2 md:last:mb-6">
       
       {/* Suggestion Buttons */}
      {suggestions.map((suggestion, index) => (
        <div key={index} className="flex flex-col gap-3">
          <div className="border rounded-xl p-2 border-gray-500 hover:border-gray-100">
            <button className="btn relative btn-neutral group w-full whitespace-nowrap rounded-xl text-left shadow-[0px_1px_6px_0px_rgba(0,0,0,0.02)] text-gray-300 md:whitespace-normal">
              <div className="flex w-full gap-2 items-center justify-center">
                <div className="flex w-full items-center justify-between">
                  <div className="flex flex-col overflow-hidden">
                    <div className="truncate font-semibold">
                      {suggestion.title}
                    </div>
                    <div className="truncate opacity-50">
                      {suggestion.description}
                    </div>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      ))}

           {/* Input form */}
           <div className="flex w-full items-center justify-center">
          <div className="flex flex-col w-full flex-grow overflow-hidden relative rounded-xl bg-[#40414F] border border-gray-900/50 shadow-xs text-white">
            <textarea
              className="w-full p-2 pl-4 pt-2 bg-transparent placeholder-white/50 rounded-xl resize-none focus:border-2 focus:border-gray-500"
              placeholder="Send a message"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
            ></textarea>
            <button
              onClick={createNewChat}
              disabled={!prompt}
              className="absolute right-2 bottom-1.5 p-1 rounded-md disabled:hover:bg-transparent disabled:text-gray-400 enabled:bg-brand-purple text-white md:bottom-3 md:p-2 md:right-3 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <PaperAirplaneIcon className="w-6 h-6 hover:text-[#11A37F]" />
            </button>
          </div>
        </div>
        </form>
      </div>
    </div>
  );
}
