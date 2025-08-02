'use client'
import Link from 'next/link'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { auth } from '@/app/firebase/config'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'

function Navbar() {
  const [user, setUser] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
    })

    return () => unsubscribe()
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
     <nav className="bg-white shadow-md fixed w-full z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-[#0066B1]">
              <div className='flex gap-2'>
                <Link href="/">VPT</Link>
                <Image src="/racing.png" alt="VPT Logo" width={30} height={30} className="mx-auto" />
              </div>
              
            </div>
            <div className="space-x-6 flex items-center">
              <Link href="/features" className="text-gray-600 hover:text-[#0066B1] transition-colors font-medium">
                Features
              </Link>
              {!user ? (
                <Link  href="/signin"  className="bg-[#0066B1] text-white px-6 py-2 rounded-md hover:bg-[#0077CC] transition-colors font-medium" >
                  Sign In
                </Link>
              ) : (
                <div className="relative">
                  <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center focus:outline-none">
                    <Image src={user.photoURL || '/default-avatar.png'} alt="Profile" width={40} height={40} className="rounded-full ring-2 ring-gray-300 cursor-pointer" />
                  </button>
                  
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        {user.displayName || user.email}
                      </div>
                      <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Dashboard
                      </Link>
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Profile
                      </Link>
                      <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
  )
}

export default Navbar