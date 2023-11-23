import { useSession } from "next-auth/react";
import Image from 'next/image';

type Props = {
  message: {
    Content: string;
    Role: string;
  };
};

function Message({ message }: Props) {
  const { data: session } = useSession();
  const { Content, Role } = message;
  const isSmartChat = Role === "assistant";
  
  // If Content or Role is undefined, return null or a default message
  if (typeof Content === 'undefined' || typeof Role === 'undefined') {
    return <div>Message is missing content or role.</div>;
}

  // Define the assistant's image URL (update this to your assistant's image URL)
  const assistantImageURL = "/path-to-assistant-image.jpg";

  const messageClasses = `py-5 text-white ${isSmartChat ? "bg-gray-700" : ""}`;

  // Function to extract initials
  function getInitials(fullName: string) {
    const names = fullName.split(' ');
    const initials = names.map(name => name[0]).join('');
    return initials;
  }

  return (
    <div className={messageClasses}>
      <div className="flex items-center space-x-5 px-5 max-w-2xl mx-auto">
        {isSmartChat ? (
          // Display the assistant's image
          <Image 
          src="/icon.png" 
            alt="Assistant" 
            className="h-10 w-10 rounded-full mr-3"
            width={40} 
            height={40}
          />
        ) : session?.user?.image ? (
          // Display the user's image
          <Image 
            src={session.user.image} 
            alt="Profile" 
            className="h-10 w-10 rounded-full mr-3 border-2 border-blue-700"
            width={40} 
            height={40}
          />
        ) : (
          // Display initials if no image is available
          <div className="h-10 w-10 rounded-full mr-3 border-2 border-blue-700 flex items-center justify-center bg-gray-700 text-white font-semibold">
            {getInitials(session?.user?.name ?? "")}
          </div>
        )}
        <p className="pt-1 text">{Content}</p>
      </div>
    </div>
  );
}

export default Message;