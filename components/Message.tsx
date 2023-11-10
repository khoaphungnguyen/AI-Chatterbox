import { DocumentData } from "firebase/firestore";

type Props = {
  message: DocumentData;
};
function Message({ message }: Props) {
  const { user: { name, avatar }, content } = message;
  const isSmartChat = name === "SmartChat";
  const messageClasses = `py-5 text-white ${isSmartChat ? "bg-gray-700" : ""}`;

  return (
    <div className={messageClasses}>
      <div className="flex items-center space-x-5 px-5 max-w-2xl mx-auto">
        {/* User avatar */}
        <img src={avatar} alt={`${name}'s avatar`} className="h-8 w-8 rounded-full" />
        {/* Message content */}
        <p className="pt-1 text">{content}</p>
      </div>
    </div>
  );
}

export default Message;
