'use client'

import React, { useEffect, useState, useRef, FormEvent, ChangeEvent } from 'react';
import { getSession } from "next-auth/react";

const ChatPage: React.FC = () => {
const [messages, setMessages] = useState<string[]>([]);
const [question, setQuestion] = useState<string>('');
const messagesEndRef = useRef<null | HTMLDivElement>(null);
const eventSourceRef = useRef<EventSource | null>(null);
    
    useEffect(() => {
                const eventSource = new EventSource('/api/chat/stream/bc3bc05d-6add-4e6a-8e32-382433858baa',{
                    withCredentials:true
                });
                eventSource.onmessage = (event) => {
                    const newMessage = event.data;
                    setMessages((prevMessages) => [...prevMessages, newMessage]);
                };
                
                eventSource.onerror = (error) => {
                    console.error('EventSource failed:', error);
                    // Implement reconnect logic if needed
                };
        
                eventSourceRef.current = eventSource;
        
                return () => {
                    // Close the SSE connection when the component unmounts
                    eventSourceRef.current?.close();
                };
            }, []);

        const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (question) {
                const session = await getSession();
                const token = session?.accessToken
                // Send question to your API (which forwards it to the Go backend)
                await fetch('/api/chat/message/bc3bc05d-6add-4e6a-8e32-382433858baa', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Include the token in the request
                    },
                    body: JSON.stringify({ message: question }),
                });
                setQuestion(''); // Clear input field
            }
        };
    
        const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
            setQuestion(e.target.value);
        };
    
        return (
            <div className='flex flex-col justify-end p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md space-y-4'>
                <h1 className="text-center font-bold text-xl">Chat with OpenAI</h1>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
                    <input
                        className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        type="text"
                        value={question}
                        onChange={handleInputChange}
                        placeholder="Ask a question"
                    />
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        type="submit"
                    >
                        Send
                    </button>
                </form>
                <div className='p-2 border border-gray-200 rounded'>
                    {messages.map((msg, index) => (
                        <span key={index} className={`inline text-blue-600}`}>
                            {msg + ' '}
                        </span>
                    ))}
                </div>
                <div ref={messagesEndRef} />
            </div>
        );
    };
    
    export default ChatPage;
    

