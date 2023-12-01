import ModelButton from "./ModelButton";

interface HeaderProps {
  model: 'gpt-3.5-turbo-1106' | 'gpt-4-1106-preview';
}

const Header: React.FC<HeaderProps> = ({ model }) => {
  return (
    <div className="w-full px-4 py-4 sticky top-0 bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-md">
      <div className="flex justify-center gap-4">
        <ModelButton label="GPT 3.5" icon="bolt" isActive={model === 'gpt-3.5-turbo-1106'} />
        <ModelButton label="GPT 4" icon="sparkles" isActive={model === 'gpt-4-1106-preview'} />
      </div>
    </div>
  );
};

export default Header;
