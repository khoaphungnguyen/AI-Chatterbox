import ModelButton from "./ModelButton";
import useSWR from 'swr';

const Header: React.FC = () => {
  const { data: model, mutate: setModel } = useSWR('model', {
    fallbackData: 'gpt-3.5-turbo-1106' // Set the default or fallback model
  });

  return (
    <header className="w-full px-4 py-4 sticky top-0 bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left py-8 md:py-0">
          <h1 className="text-2xl md:text-3xl font-semibold relative inline-block">
            Smart
            <span className="absolute top-2 transform translate-x-full 
            -translate-y-full bg-yellow-500 text-yellow-900 px-2 py-1 
            rounded-full text-sm md:text-base font-semibold animate-bounce">
              Chat
            </span>
          </h1>
        </div>
        <div className="flex gap-4">
          <ModelButton 
            label="GPT 3.5" 
            icon="bolt" 
            isActive={model === 'gpt-3.5-turbo-1106'} 
            onClick={() => setModel('gpt-3.5-turbo-1106')}
          />
          <ModelButton 
            label="GPT 4" 
            icon="sparkles" 
            isActive={model === 'gpt-4-1106-preview'} 
            onClick={() => setModel('gpt-4-1106-preview')}
          />
          <ModelButton 
            label="Local" 
            icon="sparkles" 
            isActive={model === 'local'} 
            onClick={() => setModel('local')}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;