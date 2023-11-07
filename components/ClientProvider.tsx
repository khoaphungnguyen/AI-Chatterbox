'use client';

import React from 'react'
import { Toaster } from 'react-hot-toast'

function ClientProvider() {
  return (
    <div>
        <Toaster position="bottom-center"/>
    </div>
  )
}

export default ClientProvider