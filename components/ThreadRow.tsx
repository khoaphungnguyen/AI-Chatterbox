import React, { useState, useCallback, useEffect } from "react";
import { ChatBubbleLeftIcon, TrashIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useSWR from "swr";

type Props = {
  id: string;
  title: string;
  model: string;
  onDelete: () => void;
};

function ThreadRow({ id, title, model, onDelete }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { mutate: setModel } = useSWR("model");
  const [active, setActive] = useState(false);
  const threadModel =
    model === "gpt-3.5-turbo-1106"
      ? "Default"
      : model === "gpt-4-1106-preview"
      ? "GPT 4"
      : model === "llama2:13b"
      ? "Fast"
      : "Code";

  const handleDelete = useCallback(async () => {
    try {
      const response = await fetch(`/api/deleteThread/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete thread");
      }
      onDelete();
      toast.success("Thread deleted successfully");

      const currentPath = window.location.pathname;
      if (currentPath === `/thread/${id}`) {
        router.push("/");
      }
    } catch (error) {
      toast.error("Failed to delete thread");
    } finally {
      toast.dismiss(`delete-confirmation-${id}`);
    }
  }, [id, onDelete, router]);

  const showDeleteConfirmation = () => {
    toast(
      (t) => (
        <div className="flex justify-center items-center p-4 max-w-md w-full bg-white rounded-lg shadow-xl">
          <div className="text-center">
            <h3 className="mb-5 text-lg font-bold text-gray-900">
              Confirm Deletion
            </h3>
            <p className="mb-5 text-sm text-gray-600">
              Are you sure you want to delete this thread? This action cannot be
              undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                }}
                className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-6 rounded-md transition duration-150 ease-in-out"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
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
      }
    );
  };

  useEffect(() => {
    setActive(pathname.includes(id));
  }, [pathname, id]);

  return (
    <div
      className={`rounded-lg px-5 py-3 text-sm items-center
        space-x-2 hover:bg-gray-700/70 cursor-pointer text-gray-300
        transition-all duration-200 ease-in-out flex justify-between ${
          active && "bg-gray-700/50"
        }`}
      onClick={() => {
        setModel(model);
        router.push(`/thread/${id}`);
      }}
    >
      <ChatBubbleLeftIcon className="h-5 w-5" />
      <p className="flex-1 truncate">
        {("[" + threadModel + "] " + title || "New Thread") + "..."}
      </p>
      <TrashIcon
        onClick={(e) => {
          e.stopPropagation(); // Prevent Link navigation
          showDeleteConfirmation();
        }}
        className="h-5 w-5 text-gray-700 hover:text-red-700"
      />
    </div>
  );
}

export default ThreadRow;
