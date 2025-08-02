'use client'
import React from 'react'
import Image from 'next/image'

function Error() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <Image src="/BMW_OOPS.png" alt="Error" width={700} height={700} />
    </div>
  )
}

export default Error