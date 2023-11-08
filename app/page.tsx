'use client'
import {
  BoltIcon,
  PaperAirplaneIcon,
  SparklesIcon,
} from "@heroicons/react/20/solid";
import {useState} from 'react'
import useSWR  from "swr";
import { useSession } from 'next-auth/react'
import { collection, serverTimestamp, addDoc, orderBy, query  } from 'firebase/firestore'
import { db } from '@/firebase'
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast'

export default function Home() {
   const router = useRouter()
   const [prompt, setPrompt] = useState("");
   const {data: session} = useSession()
  const { data: model} = useSWR('model',{
    fallbackData: 'gpt-3.5-turbo-0613'
  })

  const createNewChat = async(event:React.MouseEvent<HTMLButtonElement, MouseEvent>) =>{
    event.preventDefault();
    if (!prompt) return;
    const input = prompt.trim();
    setPrompt("")

    const doc = await addDoc(collection(db, "users", session?.user?.email!, 'chats'),{
      userId: session?.user?.email!,
      createAt: serverTimestamp(),
    })

    const chatId = doc.id
    const message: Message = {
        "content": input,
        "createAt": serverTimestamp(),
        "user": {
            "_id": session?.user?.email!,
            "name": session?.user?.name!,
            "avatar": session?.user?.image! || `https://ui-avatars.com/api/?name=${session?.user?.name}`,
            "role":"user"
        }
    };

    await addDoc(collection(db, "users", session?.user?.email!, "chats", chatId, 'messages'),
     message)

    //Toast notificaiton to say Loading!
    const notificaiton = toast.loading("ChatGPT is thinking...");

    await fetch('/api/askQuestions',{
        method:"POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            messages: [{"role":'user', "content": input}],
            chatId, 
            model, 
            session
        }),
     }).then(()=>{
        // Toast notification to say successful!
        toast.success("ChatGPT has responded",{
            id:notificaiton,
        })
     });

   //router.push(`/chat/${chatId}`)
}

  return (
    <div className="flex h-full flex-col items-center justify-between pb-64">
      <div className="px-2 w-full flex flex-col py-2 md:py-6 sticky top-0">
        <div className="relative flex flex-col items-stretch justify-center gap-2 sm:items-center">
          <div className="relative flex rounded-xl  p-1 text-gray-900 bg-gray-900 ">
            <ul className="flex w-full list-none gap-1 sm:w-auto">
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
      <div className="flex h-full w-full pb-2 md:pb-[8vh]">
        <h1 className="text-4xl font-semibold text-center text-[#565869] ml-auto mr-auto mb-10 sm:mb-16 flex gap-2 items-center justify-center flex-grow">
          ChatGPT
          <span className="bg-yellow-200 text-yellow-900 py-0.5 px-1.5 text-xs  md:text-sm rounded-md ">
            PLUS
          </span>
        </h1>
      </div>
      <div
        className="w-full pt-2 md:pt-0 border-t md:border-t-0 border-transparent md:pl-2 md:w-[calc(100%-20rem)] absolute bottom-0 right-0 bg-[#343541]"
      >
        <form className="stretch mx-2 flex flex-col gap-3  last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl  ">
          <div className="relative flex h-full flex-1 items-stretch md:flex-col">
              <div className="h-full flex ml-1 md:w-full md:m-auto md:mb-4 gap-0 md:gap-2 justify-center">
                <div className="grow">
                  <div
                    className="absolute bottom-full left-0 mb-4 flex w-full grow gap-2 px-1 pb-1 sm:px-2 
                sm:pb-0 md:static md:mb-0 md:max-w-none"
                  >
                    <div className="grid w-full grid-flow-row grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-3">
                      <div className="flex flex-col gap-3">
                        <div className="border rounded-xl p-2 border-gray-500 hover:border-gray-100">
                          <button
                            className="btn relative btn-neutral group w-full whitespace-nowrap rounded-xl text-left
                   shadow-[0px_1px_6px_0px_rgba(0,0,0,0.02)] text-gray-300 md:whitespace-normal"
                          >
                            <div className="flex w-full gap-2 items-center justify-center">
                              <div className="flex w-full items-center justify-between">
                                <div className="flex flex-col overflow-hidden">
                                  <div className="truncate font-semibold">
                                    Design a database schema
                                  </div>
                                  <div className="truncate opacity-50">
                                    for an online merch store
                                  </div>
                                </div>
                              </div>
                            </div>
                          </button>
                        </div>

                        <div className="border rounded-xl p-2 border-gray-500 hover:border-gray-100">
                          <button
                            className="btn relative btn-neutral group w-full whitespace-nowrap rounded-xl text-left
                   shadow-[0px_1px_6px_0px_rgba(0,0,0,0.02)] text-gray-300 md:whitespace-normal"
                          >
                            <div className="flex w-full gap-2 items-center justify-center">
                              <div className="flex w-full items-center justify-between">
                                <div className="flex flex-col overflow-hidden">
                                  <div className="truncate font-semibold">
                                    Recommend activities
                                  </div>
                                  <div className="truncate opacity-50">
                                    for a team-building day with remote
                                    employees
                                  </div>
                                </div>
                              </div>
                            </div>
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="border rounded-xl p-2 border-gray-500 hover:border-gray-100">
                          <button
                            className="btn relative btn-neutral group w-full whitespace-nowrap rounded-xl text-left
                   shadow-[0px_1px_6px_0px_rgba(0,0,0,0.02)] text-gray-300 md:whitespace-normal"
                          >
                            <div className="flex w-full gap-2 items-center justify-center">
                              <div className="flex w-full items-center justify-between">
                                <div className="flex flex-col overflow-hidden">
                                  <div className="truncate font-semibold">
                                    Create a workout plan
                                  </div>
                                  <div className="truncate opacity-50">
                                    for resistance training
                                  </div>
                                </div>
                              </div>
                            </div>
                          </button>
                        </div>
                        <div className="border rounded-xl p-2 border-gray-500 hover:border-gray-100">
                          <button
                            className="btn relative btn-neutral group w-full whitespace-nowrap rounded-xl text-left
                   shadow-[0px_1px_6px_0px_rgba(0,0,0,0.02)] text-gray-300 md:whitespace-normal"
                          >
                            <div className="flex w-full gap-2 items-center justify-center">
                              <div className="flex w-full items-center justify-between">
                                <div className="flex flex-col overflow-hidden">
                                  <div className="truncate font-semibold">
                                    Plan a trip
                                  </div>
                                  <div className="truncate opacity-50">
                                    for a photography expedition in Iceland
                                  </div>
                                </div>
                              </div>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
          <div className="flex w-full items-center justify-center ">
            <div
              className="overflow-hidden flex flex-col w-full flex-grow relative border
          border-gray-900/50 text-white  rounded-xl shadow-xs bg-[#40414F]"
            >
         
            <textarea
            className="m-0 w-full resize-none focus:border-gray-500 bg-transparent placeholder-white/50
             rounded-xl focus:border-2 p-2 pl-4 pt-2 "
            placeholder="Send a message"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
          ></textarea>
            <button
              onClick={createNewChat}
              disabled={!prompt}
              className="absolute p-1 rounded-md md:bottom-3 md:p-2 md:right-3 disabled:hover:bg-transparent right-2 disabled:text-gray-400 enabled:bg-brand-purple text-white bottom-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
