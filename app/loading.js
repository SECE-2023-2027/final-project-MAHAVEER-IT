import React from 'react'
import Image from 'next/image'

function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
          <Image src="/BMW_LOADING.png" alt="Loading" width={700} height={700} />
        </div>
  )
}

export default Loading