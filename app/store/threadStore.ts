import {create} from 'zustand'
import { ChatMessage } from "@/typings"; // Assuming ChatMessage is already defined

// Define the shape of your chat state
interface ChatState {
    messages: ChatMessage[];
    isStreaming: boolean;
    error: string | null;
    setIsStreaming: (streaming: boolean) => void;
    reset: () => void;
    addMessage: (message: ChatMessage) => void;

}

// Create the store with the initial state and actions
const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isStreaming: false,
  error: null,


  setIsStreaming: (streaming) => set({ isStreaming: streaming }),

  // Reset function
  reset: () => set({ messages: [], isStreaming: false, error: null }),

  // Add a message to the state
  addMessage: (message: ChatMessage) => 
    set((state) => ({ messages: [...state.messages, message] })),

}));

export default useChatStore;
