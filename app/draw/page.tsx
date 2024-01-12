'use client'

import React from 'react'

import { Tldraw } from '@tldraw/tldraw'
import GenerateButton from '@/components/GenerateButton'


function DrawPage() {
  return (
    <main className='h-screen w-screen'>
      <Tldraw persistenceKey="draw" >
        <GenerateButton />
      </Tldraw>
    </main>
  )
}

export default DrawPage