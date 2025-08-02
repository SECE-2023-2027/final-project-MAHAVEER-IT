import Image from 'next/image'
import React from 'react'

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <Image src="/BMW_404.png" alt="Not Found" width={700} height={700} />
    </div>
  )
}

export default NotFound