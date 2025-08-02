'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';


function Profile() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
  
    if (!user) {
      router.push('/signin');
      return;
    }

    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
     
        const userResponse = await fetch(`/api/auth?uid=${user.uid}`);
        const userResult = await userResponse.json();
        
        if (!userResponse.ok) {
          throw new Error(userResult.error || 'Failed to fetch user data');
        }
        
        if (!userResult.success) {
          throw new Error(userResult.error || 'Failed to fetch user data');
        }
        
      
        setUserData(userResult.data.user);
        
        
        const bookingsResponse = await fetch(`/api/bookings/history?uid=${user.uid}&limit=10`);
        const bookingsResult = await bookingsResponse.json();
        
        if (bookingsResponse.ok && bookingsResult.success) {
         
          const bookings = bookingsResult.data.map(booking => {
          
            const processedBooking = { ...booking };
            if (booking.startTime && typeof booking.startTime === 'object') {
              processedBooking.startTime = new Date(booking.startTime.seconds * 1000);
            }
            if (booking.endTime && typeof booking.endTime === 'object') {
              processedBooking.endTime = new Date(booking.endTime.seconds * 1000);
            }
            if (booking.createdAt && typeof booking.createdAt === 'object') {
              processedBooking.createdAt = new Date(booking.createdAt.seconds * 1000);
            }
            return processedBooking;
          });
          
          setBookingHistory(bookings);
        } else {
          console.error('Failed to fetch booking history:', bookingsResult.error);
          setBookingHistory([]);
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user, router]);

 
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  

  const formatDateTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push('/signin');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

 
  const handleEditName = () => {
    setNewName(userData?.name || user?.displayName || '');
    setIsEditingName(true);
  };

  const handleSaveName = async () => {
    try {
      if (!user) return;
      
    
      const response = await fetch(`/api/auth/update-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uid: user.uid,
          updates: { name: newName }
        })
      });
      
      if (response.ok) {
    
        setUserData(prev => ({ ...prev, name: newName }));
        setIsEditingName(false);
      } else {
        console.error('Failed to update name');
      }
    } catch (err) {
      console.error('Error updating name:', err);
    }
  };

  const handleEditPhone = () => {
    setNewPhone(userData?.phoneNumber || user?.phoneNumber || '');
    setIsEditingPhone(true);
  };

 
  const handleSavePhone = async () => {
    try {
      if (!user) return;
      
      const response = await fetch(`/api/auth/update-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uid: user.uid,
          updates: { phoneNumber: newPhone }
        })
      });
      
      if (response.ok) {
        
        setUserData(prev => ({ ...prev, phoneNumber: newPhone }));
        setIsEditingPhone(false);
      } else {
        console.error('Failed to update phone number');
      }
    } catch (err) {
      console.error('Error updating phone number:', err);
    }
  };
  
  const handleBookingSelection = (booking) => {
    if (selectedBooking && selectedBooking.id === booking.id) {
      setSelectedBooking(null); 
    } else {
      setSelectedBooking(booking); 
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-[#0066B1] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 p-6 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-red-700 text-lg font-semibold mb-2">Error Loading Profile</h2>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="mt-4 bg-[#0066B1] text-white px-4 py-2 rounded hover:bg-[#0055A5] transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-26 px-4">
      <div className="max-w-5xl mx-auto">
 
        <div className="bg-[#0066B1] rounded-t-2xl p-8 text-white shadow-lg relative overflow-hidden">
       
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-400 rounded-full opacity-20 -mt-20 -mr-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400 rounded-full opacity-20 -mb-16 -ml-16"></div>
          
          <div className="flex items-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-lg">
                {user?.photoURL ? (
                  <Image 
                    src={user.photoURL} 
                    alt="Profile" 
                    width={86} 
                    height={86} 
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-20 h-20 bg-[#0066B1] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {userData?.name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0066B1]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </div>
            </div>
            <div className="ml-6">
              <h1 className="text-2xl font-bold">{userData?.name || user?.displayName || 'BMW User'}</h1>
              <p className="text-blue-100">{user?.email}</p>
              <p className="text-blue-100 text-sm mt-1">Member since {formatDate(userData?.createdAt)}</p>
            </div>
          </div>
        </div>
     
        <div className="bg-white border-b flex">
          <button 
            className={`px-6 py-4 font-medium ${activeTab === 'profile' ? 'text-[#0066B1] border-b-2 border-[#0066B1]' : 'text-gray-500'}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile Details
          </button>
          <button 
            className={`px-6 py-4 font-medium ${activeTab === 'history' ? 'text-[#0066B1] border-b-2 border-[#0066B1]' : 'text-gray-500'}`}
            onClick={() => setActiveTab('history')}
          >
            Booking History
          </button>
        </div>
  
        <div className="bg-white rounded-b-2xl shadow-lg p-8">
    
          {activeTab === 'profile' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0066B1] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Personal Information
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                      {isEditingName ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-1 w-full"
                          />
                          <button 
                            onClick={handleSaveName}
                            className="bg-[#0066B1] text-white px-2 py-1 rounded text-xs hover:bg-[#0055A5]"
                          >
                            Save
                          </button>
                          <button 
                            onClick={() => setIsEditingName(false)}
                            className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="text-gray-800 font-medium">{userData?.name || user?.displayName || 'Not provided'}</div>
                          <button 
                            onClick={handleEditName}
                            className="text-[#0066B1] text-sm hover:text-[#0055A5] focus:outline-none"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Edit
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                      <div className="text-gray-800 font-medium">{user?.email}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                      {isEditingPhone ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={newPhone}
                            onChange={(e) => setNewPhone(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-1 w-full"
                          />
                          <button 
                            onClick={handleSavePhone}
                            className="bg-[#0066B1] text-white px-2 py-1 rounded text-xs hover:bg-[#0055A5]"
                          >
                            Save
                          </button>
                          <button 
                            onClick={() => setIsEditingPhone(false)}
                            className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="text-gray-800 font-medium">{userData?.phoneNumber || user?.phoneNumber || 'Not provided'}</div>
                          <button 
                            onClick={handleEditPhone}
                            className="text-[#0066B1] text-sm hover:text-[#0055A5] focus:outline-none"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Edit
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Last Login</label>
                      <div className="text-gray-800 font-medium">{formatDateTime(userData?.lastLogin)}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <hr className="border-gray-200" />
              
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0066B1] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Account Status
                </h2>
                
                <div className="flex justify-between items-center">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSignOut}
                    className="text-red-600 text-sm font-medium hover:text-red-700 focus:outline-none"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
              
              <hr className="border-gray-200" />
            </div>
          )}
          
    
          {activeTab === 'history' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0066B1] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Recent Booking History
              </h2>
              
              {bookingHistory.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="mt-4 text-gray-500">No booking history found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parking Slot</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookingHistory.map((booking) => (
                        <React.Fragment key={booking.id}>
                          <tr 
                            className={`hover:bg-gray-50 cursor-pointer ${selectedBooking?.id === booking.id ? 'bg-blue-50' : ''}`}
                            onClick={() => handleBookingSelection(booking)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0066B1]">
                              {booking.id.slice(0, 8)}...
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {booking.vehicleDetails ? 
                                `${booking.vehicleDetails.brandName} ${booking.vehicleDetails.modelName}` : 
                                booking.vehicleNumberPlate}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {booking.parkingSlot || `${booking.hostId}-${booking.parkingSlot}`}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {formatDateTime(booking.startTime)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {booking.hours}h
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                booking.status === 'active' ? 'bg-green-100 text-green-800' : 
                                booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                              </span>
                            </td>
                          </tr>
                          {selectedBooking?.id === booking.id && (
                            <tr>
                              <td colSpan={6} className="px-6 py-4 bg-blue-50 border-t border-blue-100">
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <h4 className="font-medium text-gray-800 mb-2">Booking Details</h4>
                                    <p><span className="text-gray-600">Created:</span> {formatDateTime(booking.createdAt)}</p>
                                    {booking.updatedAt && (
                                      <p><span className="text-gray-600">Last Updated:</span> {formatDateTime(booking.updatedAt)}</p>
                                    )}
                                    <p><span className="text-gray-600">End Time:</span> {formatDateTime(booking.endTime)}</p>
                                    <p><span className="text-gray-600">Host:</span> {booking.hostId}</p>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-medium text-gray-800 mb-2">Vehicle Details</h4>
                                    {booking.vehicleDetails ? (
                                      <>
                                        <p><span className="text-gray-600">Brand:</span> {booking.vehicleDetails.brandName}</p>
                                        <p><span className="text-gray-600">Model:</span> {booking.vehicleDetails.modelName}</p>
                                        <p><span className="text-gray-600">Type:</span> {booking.vehicleDetails.vehicleType}</p>
                                        {booking.vehicleDetails.visitorName && (
                                          <p><span className="text-gray-600">Visitor:</span> {booking.vehicleDetails.visitorName}</p>
                                        )}
                                      </>
                                    ) : (
                                      <p><span className="text-gray-600">Vehicle:</span> {booking.vehicleNumberPlate}</p>
                                    )}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                  
                  <div className="mt-6 text-center">
                    <button 
                      onClick={() => {
                        const fetchMoreBookings = async () => {
                          try {
                            setIsLoading(true);
                            const response = await fetch(`/api/bookings/history?uid=${user.uid}&limit=20`);
                            const result = await response.json();
                            
                            if (response.ok && result.success) {
                          
                              const bookings = result.data.map(booking => {
                              
                                const processedBooking = { ...booking };
                                if (booking.startTime && typeof booking.startTime === 'object') {
                                  processedBooking.startTime = new Date(booking.startTime.seconds * 1000);
                                }
                                if (booking.endTime && typeof booking.endTime === 'object') {
                                  processedBooking.endTime = new Date(booking.endTime.seconds * 1000);
                                }
                                if (booking.createdAt && typeof booking.createdAt === 'object') {
                                  processedBooking.createdAt = new Date(booking.createdAt.seconds * 1000);
                                }
                                return processedBooking;
                              });
                              
                              setBookingHistory(bookings);
                            }
                          } catch (err) {
                            console.error('Error fetching more booking history:', err);
                          } finally {
                            setIsLoading(false);
                          }
                        };
                        
                        fetchMoreBookings();
                      }}
                      className="text-[#0066B1] font-medium hover:text-[#0055A5] focus:outline-none"
                    >
                      View More Booking History
                    </button>
                  </div>
                </div>
              )}
              
              <div className="mt-8 bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Booking Information</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>Your booking history shows all your parking reservations. For any questions regarding your bookings, please contact customer support.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;