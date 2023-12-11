import { PlusIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation"; // Ensure this import is correct
import { toast } from 'react-hot-toast'; // Import toast

interface NewThreadProps {
  onNewThreadCreated: () => void;
}

function NewThread({ onNewThreadCreated }: NewThreadProps) {
  const router = useRouter();

  const createNewThread = async () => {
    // Start a loading toast before the request
    const loadingToast = toast.loading('Creating new thread...');

    try {
      const response = await fetch('/api/createThread', { method: 'POST' });
      if (!response.ok) {
        throw new Error(`Failed to create thread: ${response.statusText}`);
      }
      const data = await response.json();

      // Dismiss the loading toast and show a success toast
      toast.dismiss(loadingToast);
      toast.success('Thread created successfully!');

      router.push(`/thread/${data.threadId.id}`);
      onNewThreadCreated && onNewThreadCreated();
    } catch (error) {
      // Dismiss the loading toast and show an error toast
      toast.dismiss(loadingToast);
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      } else {
        // Fallback for errors that aren't instances of the Error class
        toast.error('An unknown error occurred');
      }
    }
  };

  return (
    <div
      onClick={createNewThread}
      className="flex items-center space-x-2 border border-gray-700 bg-blue-500/50 hover:bg-blue-600/50 text-white px-4 py-2 rounded-md cursor-pointer transition-colors duration-300 ease-in-out"
    >
      <PlusIcon className="h-6 w-6"/>
      <h1 className="text-lg font-semibold">New Thread</h1>
    </div>
  );
}

export default NewThread;
