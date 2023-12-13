import { create } from 'zustand';
import { ChatMessage } from "@/typings";
import { v4 as uuidv4 } from 'uuid';

interface MessageState {
  threads: { [key: string]: ChatMessage[] };
  streamingContent: { [key: string]: string }; // To accumulate streaming messages
  addMessage: (threadId: string, message: ChatMessage) => void;
  addStreamingContent: (threadId: string, content: string) => void;
  setStreamingContent: (threadId: string, content: string) => void;
  finalizeStream: (threadId: string) => void;
}

const useMessageStore = create<MessageState>((set) => ({
  threads: {},
  streamingContent: {},

  addMessage: (threadId, message) => set((state) => ({
    threads: {
      ...state.threads,
      [threadId]: [...(state.threads[threadId] || []), message],
    },
  })),

  addStreamingContent: (threadId, content) => set((state) => {
    const currentContent = state.streamingContent[threadId] || '';
    return {
      streamingContent: {
        ...state.streamingContent,
        [threadId]: currentContent + content,
      },
    };
  }),
  // Function to initialize or update streaming content
  setStreamingContent: (threadId, content) => set((state) => ({
    streamingContent: {
      ...state.streamingContent,
      [threadId]: content,
    },
  })),

  finalizeStream: (threadId) => set((state) => {
    const fullMessageContent = state.streamingContent[threadId] || '';
    // Clear the streaming content if it's just an empty string from the start or end signal
    if (!fullMessageContent.trim()) return {
      ...state,
      streamingContent: { ...state.streamingContent, [threadId]: '' },
    };
  
    const newMessage: ChatMessage = {
      id: uuidv4(),
      content: fullMessageContent,
      role: 'assistant', // or any other role that suits your application
      createdAt: new Date().toISOString(),
    };
  
    // Reset the streaming content and add the new message to the thread
    return {
      ...state,
      threads: {
        ...state.threads,
        [threadId]: [...(state.threads[threadId] || []), newMessage].reverse(),
      },
      streamingContent: { ...state.streamingContent, [threadId]: '' },
    };
  }),
}))

export default useMessageStore;
