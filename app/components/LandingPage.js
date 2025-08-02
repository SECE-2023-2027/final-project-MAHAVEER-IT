'use client'
import React, { use, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { auth, db } from '@/app/firebase/config';

function LandingPage() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 pt-8 pb-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 space-y-8">
            <div className="space-y-2">
              <h2 className="text-[#0066B1] font-semibold tracking-wider">PREMIUM PARKING SOLUTION</h2>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                The Ultimate in Visitor Parking Management
              </h1>
            </div>
            <p className="text-xl text-gray-600">
              Experience precision engineering in parking management. 
              Elevate your property&apos;s parking experience with German-inspired efficiency.
            </p>
            <div className="space-x-6">
              {!user ? (
                <Link href="/signin" className="bg-[#0066B1] text-white px-8 py-4 rounded-md hover:bg-[#0077CC] transition-all transform hover:scale-105 shadow-lg">
                  Get Started
                </Link>
              ) : (
                <Link href="/dashboard" className="bg-[#0066B1] text-white px-8 py-4 rounded-md hover:bg-[#0077CC] transition-all transform hover:scale-105 shadow-lg">
                  Go to Dashboard
                </Link>
              )}
              <Link href="/features" className="border-2 border-[#0066B1] text-[#0066B1] px-8 py-4 rounded-md hover:bg-[#0066B1]/5 transition-all transform hover:scale-105">
                Learn More
              </Link>
            </div>
          </div>
          <div className="flex-1 relative h-[500px]">
            <div className="absolute inset-0 bg-[#0066B1]/5 rounded-xl"></div>
            <Image src="/BMW.png" alt="Parking Management Illustration" fill className="object-contain p-8" priority />
          </div>
        </div>
      </div>
      <div className="bg-[#F6F6F6] py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Premium Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow group">
              <div className="w-16 h-16 mb-6 p-3 bg-[#0066B1]/10 rounded-lg group-hover:bg-[#0066B1]/20 transition-colors">
                <Image src="/car.png" alt="Vehicle Registration" width={48} height={48} className="text-[#0066B1]" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Vehicle Registration</h3>
              <p className="text-gray-600">
                Register vehicles with license plate, brand, and model details for quick check-in access.
              </p>
            </div>
            <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow group">
              <div className="w-16 h-16 mb-6 p-3 bg-[#0066B1]/10 rounded-lg group-hover:bg-[#0066B1]/20 transition-colors">
                <Image src="/quick.png" alt="Slot Booking" width={48} height={48} className="text-[#0066B1]" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Smart Slot Booking</h3>
              <p className="text-gray-600">
                Book premium parking slots at multiple locations with flexible duration options.
              </p>
            </div>
            <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow group">
              <div className="w-16 h-16 mb-6 p-3 bg-[#0066B1]/10 rounded-lg group-hover:bg-[#0066B1]/20 transition-colors">
                <Image src="/rc.png" alt="Booking Management" width={48} height={48} className="text-[#0066B1]" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Booking Management</h3>
              <p className="text-gray-600">
                Extend, cancel, and track your booking history with an intuitive dashboard interface.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage