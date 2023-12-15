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
  updateMessage: (id: string, updateContent: (prevContent: string) => string) => void;
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
      return { messages: updatedMessages };
    } else {
      return {};
    }
  }),

  addMessage: (message) => set((state) => {
    if (message.role === 'user' || !message.streamId) {
      return { messages: [...state.messages, message] };
    }

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

  updateMessage: (id, updateContent) => set(prevState => {
    const messageIndex = prevState.messages.findIndex(message => message.id === id);
    if (messageIndex === -1) return prevState;
    const updatedMessage = { ...prevState.messages[messageIndex], content: updateContent(prevState.messages[messageIndex].content) };
    return { ...prevState, messages: [...prevState.messages.slice(0, messageIndex), updatedMessage, ...prevState.messages.slice(messageIndex + 1)] };
  }),
}));

export default useChatStore;