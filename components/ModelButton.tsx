import { BoltIcon, SparklesIcon ,FireIcon} from "@heroicons/react/24/solid";

// Define a type for the props
type ModelButtonProps = {
  label: string;
  isActive: boolean;
  icon?: 'bolt' | 'sparkles'|'fire'; // Make the icon prop optional
  onClick: () => void;
};

const ModelButton = ({ label, isActive, icon, onClick }: ModelButtonProps) => {
  const IconComponent = icon === 'bolt' ? BoltIcon : icon === 'sparkles' ? SparklesIcon : FireIcon; 
  const iconColor = icon === 'bolt' ? 'text-green-500' : icon === 'sparkles' ? 'text-purple-500' : 'text-red-500';    
    return (
      <button
        onClick={onClick} 
        className={`flex items-center justify-center gap-1 px-4 py-2 rounded-lg border transition duration-100 ease-in-out
        ${isActive ? "bg-gray-700 border-gray-700 text-gray-100 shadow-lg hover:bg-gray-600 hover:text-gray-200" : "text-gray-500 border-gray-600 hover:bg-gray-700 hover:text-gray-100"}`}
        aria-label={`Select ${label}`}
      >
        <span className="hidden sm:block">{label}</span>
        <IconComponent className={`w-5 h-5 ${isActive ? iconColor : 'group-hover:text-gray-100'}`} />
      </button>
    );
};

export default ModelButton;