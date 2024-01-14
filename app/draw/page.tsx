"use client";

import GenerateButton from "@/components/GenerateButton";
import PreviewModal from "@/components/PreviewModal";
import dynamic from "next/dynamic";
import { useState } from "react";

const Tldraw = dynamic(
  () => import("@tldraw/tldraw").then((value) => value.Tldraw),
  {
    ssr: false,
  }
);

export default function Home() {
  const [html, setHtml] = useState<null | string>(`<!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interactive Button Challenge</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    function moveButton() {
      const button = document.getElementById('actionButton');
      const maxX = window.innerWidth - button.clientWidth;
      const maxY = window.innerHeight - button.clientHeight;
      button.style.top = Math.random() * maxY + 'px';
      button.style.left = Math.random() * maxX + 'px';
    }
  </script>
  <style>
    #actionButton {
      position: absolute;
      transition: top 0.2s, left 0.2s;
    }
  </style>
  </head>
  <body class="bg-gray-800 flex justify-center items-center h-screen">
    <div class="text-center">
      <h1 class="text-white text-4xl mb-8">Try to click me</h1>
      <button id="actionButton" onmouseover="moveButton()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Button
      </button>
    </div>
  </body>
  </html>`);

  return (
    <>
      {html && <PreviewModal html={html} setHtml={setHtml} />}

      <main className="w-screen h-screen">
        <Tldraw persistenceKey="tldraw">
          <GenerateButton setHtml={setHtml} />
        </Tldraw>
      </main>
    </>
  );
}
