'use client';

import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { useState } from 'react';
import { auth } from '@/app/firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';

function UserRegisterForm() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [submissionError, setSubmissionError] = useState('');
  
  const { 
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setSubmissionError('');
      
   
      if (!user) {
        setSubmissionError('You must be logged in to register a vehicle');
        router.push('/signin');
        return;
      }
      
     
      const vehicleData = {
        visitorName: data.visitorName,
        brandName: data.brandName,
        modelName: data.modelName,
        numberPlate: data.numberPlate,
        vehicleType: data.vehicleType,
        parkingSlot: data.parkingSlot,
        entryTime: data.entryTime,
        hours: data.hours,
      };
      
     
      const response = await fetch('/api/regform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            phoneNumber: user.phoneNumber || '',
          },
          vehicleData
        }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to register vehicle');
      }
      
      console.log('Registration successful:', result);
      reset(); 
    } catch (error) {
      console.error('Registration error:', error);
      setSubmissionError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-30 px-4">
      <div className="max-w-lg mx-auto">
    
        <div className="flex flex-col justify-center items-center text-center mb-8">
          <Image src="/racing.png" alt="Logo" width={54} height={54} />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
            VISITOR VEHICLE
          </h1>
          <h2 className="text-xl font-light text-gray-600 tracking-wide">ENTRY SYSTEM</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-800 mx-auto mt-2 rounded-full"></div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)}>
      
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
            <h3 className="text-xl font-semibold text-white tracking-wide">REGISTRATION DETAILS</h3>
            <p className="text-blue-100 text-sm mt-1">Please fill in all required information</p>
          </div>

          <div className="px-8 py-6 space-y-6">
      
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
                VISITOR NAME
              </label>
              <input
                type="text"
                {...register('visitorName', { required: 'Visitor name is required' })}
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-gray-50 focus:bg-white"
                placeholder="Enter visitor's full name"
              />
              {errors.visitorName && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <span className="w-4 h-4 bg-red-500 rounded-full mr-2 text-xs flex items-center justify-center text-white">!</span>
                  {errors.visitorName.message}
                </p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
  
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
                  VEHICLE BRAND
                </label>
                <input
                  type="text"
                  {...register('brandName', { required: 'Brand name is required' })}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-gray-50 focus:bg-white"
                  placeholder="e.g., BMW, Mercedes"
                />
                {errors.brandName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="w-4 h-4 bg-red-500 rounded-full mr-2 text-xs flex items-center justify-center text-white">!</span>
                    {errors.brandName.message}
                  </p>
                )}
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
                  VEHICLE MODEL
                </label>
                <input
                  type="text"
                  {...register('modelName', { required: 'Model name is required' })}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-gray-50 focus:bg-white"
                  placeholder="e.g., X5, 320i"
                />
                {errors.modelName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="w-4 h-4 bg-red-500 rounded-full mr-2 text-xs flex items-center justify-center text-white">!</span>
                    {errors.modelName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
                NUMBER PLATE
              </label>
              <input type="text" placeholder="TN38AZ1234" {...register('numberPlate', { required: 'Number plate is required',
                  pattern: {
                    value: /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/,
                    message: 'Format should be like TN38AZ1234',
                  },
                })}
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-gray-50 focus:bg-white font-mono text-lg tracking-wider"
              />
              {errors.numberPlate && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <span className="w-4 h-4 bg-red-500 rounded-full mr-2 text-xs flex items-center justify-center text-white">!</span>
                  {errors.numberPlate.message}
                </p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
                  VEHICLE TYPE
                </label>
                <select
                  {...register('vehicleType', { required: 'Please select vehicle type' })}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-gray-50 focus:bg-white"
                >
                  <option value="">Select Type</option>
                  <option value="Two Wheeler">Two Wheeler</option>
                  <option value="Four Wheeler">Four Wheeler</option>
                  <option value="Heavy Vehicle">Heavy Vehicle</option>
                  <option value="Electric Vehicle">Electric Vehicle</option>
                </select>
                {errors.vehicleType && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="w-4 h-4 bg-red-500 rounded-full mr-2 text-xs flex items-center justify-center text-white">!</span>
                    {errors.vehicleType.message}
                  </p>
                )}
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
                  PARKING SLOT
                </label>
                <select
                  {...register('parkingSlot', { required: 'Please select a slot' })}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-gray-50 focus:bg-white"
                >
                  <option value="">Select Slot</option>
                  <option value="P1">P1 - Premium</option>
                  <option value="P2">P2 - Standard</option>
                  <option value="P3">P3 - Economy</option>
                </select>
                {errors.parkingSlot && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="w-4 h-4 bg-red-500 rounded-full mr-2 text-xs flex items-center justify-center text-white">!</span>
                    {errors.parkingSlot.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
             
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
                  ENTRY DATE & TIME
                </label>
                <input
                  type="datetime-local"
                  {...register('entryTime', { required: 'Entry time is required' })}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-gray-50 focus:bg-white"
                />
                {errors.entryTime && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="w-4 h-4 bg-red-500 rounded-full mr-2 text-xs flex items-center justify-center text-white">!</span>
                    {errors.entryTime.message}
                  </p>
                )}
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
                  DURATION (HOURS)
                </label>
                <input
                  type="number"
                  {...register('hours', {
                    required: 'Please enter number of hours',
                    min: { value: 1, message: 'Minimum 1 hour' },
                  })}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-gray-50 focus:bg-white"
                  placeholder="Enter hours"
                />
                {errors.hours && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="w-4 h-4 bg-red-500 rounded-full mr-2 text-xs flex items-center justify-center text-white">!</span>
                    {errors.hours.message}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 rounded-lg font-semibold tracking-wide text-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-900 hover:shadow-lg hover:transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    PROCESSING...
                  </div>
                ) : (
                  'REGISTER VEHICLE'
                )}
              </button>
            </div>

            {isSubmitSuccessful && !submissionError && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 flex items-center">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm">✓</span>
                </div>
                <p className="text-green-700 font-semibold">REGISTRATION SUCCESSFUL!</p>
              </div>
            )}
            
            {submissionError && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-center">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm">!</span>
                </div>
                <p className="text-red-700 font-semibold">{submissionError}</p>
              </div>
            )}
          </div>

          <div className="bg-gray-50 border-t border-gray-200 px-8 py-4">
            <p className="text-gray-500 text-sm text-center">
              Secure vehicle registration system • All data encrypted
            </p>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserRegisterForm;