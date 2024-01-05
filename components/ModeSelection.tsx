'use client'

import useSWR from "swr";
import Select from 'react-select';

// Define a type for your option
type OptionType = {
  value: string;
  label: string;
};

function ModeSelection() {
  // Use SWR for managing the selected model state if needed
  const { data: model, mutate: setModel} = useSWR('model', {
    fallbackData: 'llama2:13b-chat' // Set the default or fallback model
  });

  // Directly define the models you want to use as options
  const modelOptions = [
    { value: 'llama2:13b-chat', label: 'Default' },
    { value: 'openchat', label: 'GPT-3.5' },
    { value: 'gpt-4-1106-preview', label: 'GPT-4' },
    { value: 'codellama:13b', label: 'Code'}
  ];

  // Handler for when a new model is selected
  const handleModelChange = (selectedOption: OptionType | null) => {
    if (selectedOption !== null) {
      setModel(selectedOption.value);
    }
  };

  return (
    <div>
      <Select 
        className="mt-2"
        options={modelOptions}
        defaultValue={modelOptions.find(opt => opt.value === model)} // Set the default value based on the current model
        placeholder="Select a model"
        isSearchable={false} // If you only have two options, search might not be necessary
        menuPosition="fixed"
        classNamePrefix="react-select"
        onChange={handleModelChange}
      />
    </div>
  )
}

export default ModeSelection;
