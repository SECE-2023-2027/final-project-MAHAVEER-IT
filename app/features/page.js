import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

function Features() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="relative h-[20vh] md:h-[30vh] bg-[#0066B1] overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-pattern"></div>
        <div className="container mx-auto px-6 h-full flex flex-col justify-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Advanced Parking Management Features
            </h1>
            <p className="text-xl text-white/90">
              Our cutting-edge visitor parking system delivers precision, efficiency, and control.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-full md:w-1/3 h-full opacity-20 md:opacity-40">
          <div className="relative w-full h-full">
            <Image
              src="/racing.png"
              alt="BMW Logo Watermark"
              fill
              style={{ objectFit: 'contain', objectPosition: 'right bottom' }}
              priority
            />
          </div>
        </div>
      </div>

  
      <div className="container mx-auto px-6 py-16">
    
        <div className="mb-24">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 mb-8 md:mb-0">
              <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden shadow-xl border-2 border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0066B1]/10 to-[#0066B1]/5 rounded-lg"></div>
                <Image
                  src="/BMW_1.png"
                  alt="Vehicle Registration"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 md:pl-12">
              <div className="inline-block mb-4">
                <div className="flex items-center space-x-2">
                  <div className="h-1 w-12 bg-[#0066B1]"></div>
                  <p className="text-sm font-semibold text-[#0066B1] uppercase tracking-wider">Core Feature</p>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Vehicle Registration System</h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#0066B1]/10 flex items-center justify-center mt-1">
                    <div className="h-3 w-3 rounded-full bg-[#0066B1]"></div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Digital Vehicle Profiles</h3>
                    <p className="mt-1 text-gray-600">Register multiple vehicles with comprehensive details including license plate, make, model and type.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#0066B1]/10 flex items-center justify-center mt-1">
                    <div className="h-3 w-3 rounded-full bg-[#0066B1]"></div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Guest Vehicle Support</h3>
                    <p className="mt-1 text-gray-600">Easily register visitor vehicles with temporary access permissions.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#0066B1]/10 flex items-center justify-center mt-1">
                    <div className="h-3 w-3 rounded-full bg-[#0066B1]"></div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Status Tracking</h3>
                    <p className="mt-1 text-gray-600">Real-time status indicators showing whether vehicles are currently booked or available.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-24">
          <div className="flex flex-col md:flex-row-reverse items-center">
            <div className="w-full md:w-1/2 mb-8 md:mb-0">
              <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden shadow-xl border-2 border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0066B1]/10 to-[#0066B1]/5 rounded-lg"></div>
                <Image
                  src="/BMW_2.png"
                  alt="Parking Booking System"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 md:pr-12">
              <div className="inline-block mb-4">
                <div className="flex items-center space-x-2">
                  <div className="h-1 w-12 bg-[#0066B1]"></div>
                  <p className="text-sm font-semibold text-[#0066B1] uppercase tracking-wider">Premium Experience</p>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Advanced Booking Management</h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#0066B1]/10 flex items-center justify-center mt-1">
                    <div className="h-3 w-3 rounded-full bg-[#0066B1]"></div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Multiple Location Support</h3>
                    <p className="mt-1 text-gray-600">Book parking slots across different locations with real-time availability.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#0066B1]/10 flex items-center justify-center mt-1">
                    <div className="h-3 w-3 rounded-full bg-[#0066B1]"></div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Premium Slot Selection</h3>
                    <p className="mt-1 text-gray-600">Choose from premium, standard, or economy parking slots based on your preferences.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#0066B1]/10 flex items-center justify-center mt-1">
                    <div className="h-3 w-3 rounded-full bg-[#0066B1]"></div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Flexible Duration Control</h3>
                    <p className="mt-1 text-gray-600">Set precise booking durations with options to extend when needed.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-24">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 mb-8 md:mb-0">
              <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden shadow-xl border-2 border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0066B1]/10 to-[#0066B1]/5 rounded-lg"></div>
                <Image
                  src="/BMW_3.png"
                  alt="Dashboard Management"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 md:pl-12">
              <div className="inline-block mb-4">
                <div className="flex items-center space-x-2">
                  <div className="h-1 w-12 bg-[#0066B1]"></div>
                  <p className="text-sm font-semibold text-[#0066B1] uppercase tracking-wider">Smart Management</p>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Comprehensive Dashboard</h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#0066B1]/10 flex items-center justify-center mt-1">
                    <div className="h-3 w-3 rounded-full bg-[#0066B1]"></div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Active Booking Monitoring</h3>
                    <p className="mt-1 text-gray-600">Track all active bookings with detailed information including vehicle, location, and timing.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#0066B1]/10 flex items-center justify-center mt-1">
                    <div className="h-3 w-3 rounded-full bg-[#0066B1]"></div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">One-Click Management</h3>
                    <p className="mt-1 text-gray-600">Easily extend or cancel bookings with simple one-click actions.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#0066B1]/10 flex items-center justify-center mt-1">
                    <div className="h-3 w-3 rounded-full bg-[#0066B1]"></div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">User Profile Integration</h3>
                    <p className="mt-1 text-gray-600">View and manage your profile with integrated booking history and vehicle management.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Experience Premium Parking Management?</h2>
            <p className="text-xl text-gray-600 mb-8">Join thousands of users who have transformed their parking experience with our smart, efficient system.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/signin">
                <div className="inline-block px-8 py-3 bg-[#0066B1] text-white font-medium rounded-md hover:bg-[#0077CC] transition-colors shadow-md">
                  Sign In Now
                </div>
              </Link>
              <Link href="/dashboard">
                <div className="inline-block px-8 py-3 bg-white text-[#0066B1] font-medium rounded-md border-2 border-[#0066B1] hover:bg-gray-50 transition-colors shadow-md">
                  Go to Dashboard
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Features