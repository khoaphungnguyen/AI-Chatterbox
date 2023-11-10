import ModelButton from "./ModelButton";

interface HeaderProps {
  model: 'gpt-3.5-turbo-0613' | 'gpt-4';
}

const Header: React.FC<HeaderProps> = ({ model }) => {
  return (
    <div className="w-full px-4 py-4 sticky top-0 bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-md">
      <div className="flex justify-center gap-4">
        <ModelButton label="GPT 3.5" icon="bolt" isActive={model === 'gpt-3.5-turbo-0613'} />
        <ModelButton label="GPT 4" icon="sparkles" isActive={model === 'gpt-4'} />
      </div>
    </div>
  );
};

export default Header;
