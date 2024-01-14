import { CogIcon } from '@heroicons/react/24/solid'
import React, { SyntheticEvent } from 'react'
import toast from 'react-hot-toast'
import { useEditor } from '@tldraw/tldraw'
import { getSvgAsImage } from '@/lib/getSvgAsImage'
import { blobToBase64 } from '@/lib/blobToBase64'
import messageToHTML from '@/lib/messageToHTML'


type Props = {
  setHtml : (html:string) => void;
}

function GenerateButton({setHtml}:Props) {
  const [loading, setLoading] = React.useState(false)
  const editor = useEditor()
  const handleGenerateHTML = async(event: SyntheticEvent<HTMLButtonElement>) => {
    try{
      setLoading(true)
      event.preventDefault();
      // Get the image from tdDraw
      const svg = await editor.getSvg(Array.from(editor.currentPageShapeIds));
      if (!svg) {
        throw new Error("No image selected");
      }

      const png = await getSvgAsImage(svg, {
        type: "png",
        quality: 1,
        scale: 1,
      });
      const dataUrl = await blobToBase64(png!);

      // Send base64 image to API endpoint
      const response = await fetch("/api/generateDraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({image: dataUrl }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error);
      }

      const data = await response.json()

      if (!data) {
        throw new Error("No data received");
      }
      const html = messageToHTML(data)
      setHtml(html)
      toast.success('Success')
    } catch (error) {
      console.error(error)
    } finally{
      setLoading(false)
    }
  }
  return (
    <button onClick={handleGenerateHTML}className='bg-blue-500 text-white font-semibold rounded-lg text-lg z-[1000]
    absolute top-4 left-1/2 -translate-x-1/2 py-2 px-4 shadow-md shadow-blue-800/50
    hover:bg-blue-600' >
      {loading ? 
      <span className='flex justify-center items-center'>
        <span className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'/>
      </span>
      : (
        <span className='inline-flex items-center justify-center'>
        <CogIcon className='w-4 h-4 mr-1' />
        <span>Generate</span>
        </span>
      )}
    </button>
    )   
}

export default GenerateButton