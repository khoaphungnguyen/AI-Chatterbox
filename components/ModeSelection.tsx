'use client'

import useSWR from "swr"
import Select from 'react-select';

const fetchModels = () => fetch('/api/getEngines').then((res) => res.json())

function ModeSelection() {
  const { data: models, isLoading} = useSWR('models', fetchModels);
  const { data: model, mutate: setModel} = useSWR('model',{
    fallbackData: 'gpt-3.5-turbo-instruct'
  })
  return (
    <div>
      <Select 
        className="mt-2"
        options={models?.modelOptions}
        defaultValue={model}
        placeholder={model}
        isSearchable
        isLoading={isLoading}
        menuPosition="fixed"
        classNames={{
          control: (state) => state.isFocused ? 'border-red-600' : 'border-gray-300',
        }}
        onChange={(e) => setModel(e.value)}
      />
    </div>
  )
}

export default ModeSelection