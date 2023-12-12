import React, { useState, useCallback, useEffect } from 'react';
import { ChatBubbleLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type Props = {
  id: string;
  title: string;
  onDelete: () => void;
};

function ThreadRow({ id, title, onDelete }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [isToastVisible, setToastVisible] = useState(false); // To manage toast visibility
  const [active, setActive] = useState(false);
  const [isDeleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);

  const handleDelete = useCallback(async () => {
  // Close any open toasts to prevent duplicates
  toast.dismiss();

  try {
    const response = await fetch(`/api/deleteThread/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      throw new Error('Failed to delete thread');
    }
    onDelete();
    toast.success('Thread deleted successfully');

    // Fallback method to check the current URL if router does not provide it
    const currentPath = window.location.pathname;
    if (currentPath === `/thread/${id}`) {
      router.push('/');
    }
  } catch (error) {
    // Error handling
  } finally {
    setToastVisible(false);
  }
}, [id, onDelete, router]);


  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter' && isDeleteConfirmationVisible) {
      handleDelete();
    }
  }, [isDeleteConfirmationVisible, handleDelete]);

  useEffect(() => {
    setActive(pathname.includes(id));

    if (isDeleteConfirmationVisible) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (isDeleteConfirmationVisible) {
        document.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [pathname, id, isDeleteConfirmationVisible, handleKeyDown]);

  const showDeleteConfirmation = () => {
    if (isToastVisible) {
      // If a toast is already visible, do nothing
      return;
    }

    setToastVisible(true); // Indicate that a toast will be visible
    setDeleteConfirmationVisible(true);
    toast(
      (t) => (
        <div className="flex justify-center items-center p-4 max-w-md w-full bg-white rounded-lg shadow-xl">
          <div className="text-center">
            <h3 className="mb-5 text-lg font-bold text-gray-900">
              Confirm Deletion
            </h3>
            <p className="mb-5 text-sm text-gray-600">
              Are you sure you want to delete this thread? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setDeleteConfirmationVisible(false);
                  toast.dismiss(t.id);
                }}
                className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-6 rounded-md transition duration-150 ease-in-out"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setDeleteConfirmationVisible(false);
                  toast.dismiss(t.id);
                  handleDelete();
                }}
                className="text-sm bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-md transition duration-150 ease-in-out"
                autoFocus
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
        id: `delete-confirmation-${id}`,
        onClose: () => setToastVisible(false), // Reset toast visibility state when toast is closed
      }
    );
  };
  
  

  return (
    <div
      className={`rounded-lg px-5 py-3 text-sm items-center
        space-x-2 hover:bg-gray-700/70 cursor-pointer text-gray-300
        transition-all duration-200 ease-in-out flex justify-between ${
          active && 'bg-gray-700/50'
        }`}
      onClick={() => router.push(`/thread/${id}`)}
    >
      <ChatBubbleLeftIcon className='h-5 w-5' />
      <p className='flex-1 truncate'>{title || 'New Thread'}</p>
      <TrashIcon
        onClick={(e) => {
          e.stopPropagation(); // Prevent Link navigation
          showDeleteConfirmation();
        }}
        className='h-5 w-5 text-gray-700 hover:text-red-700'
      />
    </div>
  );
}

export default ThreadRow;
