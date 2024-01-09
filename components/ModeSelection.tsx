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
    fallbackData: 'gpt-3.5-turbo-1106' // Set the default or fallback model
  });

  // Directly define the models you want to use as options
  const modelOptions = [
    { value: 'gpt-3.5-turbo-1106', label: 'Default' },
    { value: 'openhermes', label: 'Fast' },
    { value: 'codellama', label: 'Code'},
    { value: 'gpt-4-1106-preview', label: 'GPT-4' }
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
