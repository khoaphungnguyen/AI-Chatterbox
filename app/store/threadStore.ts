import { create } from 'zustand';
import { ChatMessage } from "@/typings";

interface ChatState {
  messages: ChatMessage[];
  isStreaming: boolean;
  error: string | null;
  setIsStreaming: (streaming: boolean) => void;
  reset: () => void;
  addMessage: (message: ChatMessage) => void;
  setIsStreamingForMessage: (streamId: string, isStreaming: boolean) => void;
}

const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isStreaming: false,
  error: null,

  setIsStreaming: (streaming) => set(() => ({ isStreaming: streaming })),

  reset: () => set(() => ({ messages: [], isStreaming: false, error: null })),

  setIsStreamingForMessage: (streamId: string, isStreaming: boolean) => set(state => {
    const index = state.messages.findIndex(m => m.streamId === streamId);
    if (index !== -1) {
      const updatedMessages = [...state.messages];
      updatedMessages[index] = {
        ...updatedMessages[index],
        isStreaming,
      };
      return { messages: updatedMessages }; // This return should directly return an object.
    } else {
      return {}; // If no message is found, return an empty object.
    }
  }),

  addMessage: (message) => set((state) => {
    // If it's a user message or does not have a streamId, add as a new message
    if (message.role === 'user' || !message.streamId) {
      return { messages: [...state.messages, message] };
    }

    // If it's an assistant message, update or add as necessary
    const existingIndex = state.messages.findIndex(m => m.streamId === message.streamId);
    if (existingIndex !== -1) {
      const updatedMessages = [...state.messages];
      updatedMessages[existingIndex] = {
        ...updatedMessages[existingIndex],
        content: updatedMessages[existingIndex].content + message.content,
      };
      return { messages: updatedMessages };
    }
    return { messages: [...state.messages, message] };
  }),
}));

export default useChatStore;
