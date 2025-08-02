'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/app/firebase/config';
import Link from 'next/link';
import { doc, updateDoc, collection, query, where, getDocs, getDoc, setDoc, Timestamp } from 'firebase/firestore';

function Dashboard() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeBookings, setActiveBookings] = useState([]);
  const [parkingHosts, setParkingHosts] = useState([
    { id: 'host1', name: 'Central Parking Complex', slots: 20, address: '123 Main St' },
    { id: 'host2', name: 'Downtown Secure Parking', slots: 15, address: '456 Market Ave' },
    { id: 'host3', name: 'Tech Park Garage', slots: 25, address: '789 Innovation Blvd' }
  ]);
  const [selectedHost, setSelectedHost] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingHours, setBookingHours] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
   
    if (!user) {
      router.push('/signin');
      return;
    }


    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
      
        const response = await fetch(`/api/regform?uid=${user.uid}`);
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch vehicles');
        }

        const vehicleList = result.data.vehicles || [];
        setVehicles(vehicleList);
    
        const bookingsQuery = query(
          collection(db, 'bookings'),
          where('userId', '==', user.uid),
          where('status', 'in', ['active', 'pending'])
        );
        
        const bookingSnapshot = await getDocs(bookingsQuery);
        const bookings = [];
        
        bookingSnapshot.forEach(doc => {
          const booking = { id: doc.id, ...doc.data() };
      
          if (booking.startTime && booking.startTime.toDate) {
            booking.startTime = booking.startTime.toDate();
          }
          if (booking.endTime && booking.endTime.toDate) {
            booking.endTime = booking.endTime.toDate();
          }
          bookings.push(booking);
        });
        
        setActiveBookings(bookings);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load your data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user, router]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
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
  
  const isVehicleBooked = (numberPlate) => {
    return activeBookings.some(booking => 
      booking.vehicleNumberPlate === numberPlate && 
      new Date(booking.endTime) > new Date()
    );
  };
  
  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!selectedVehicle || !selectedHost || !bookingDate || !selectedSlot) {
      setBookingError('Please fill in all required fields');
      return;
    }
    
    try {
      setBookingInProgress(true);
      setBookingError('');
      
      if (isVehicleBooked(selectedVehicle)) {
        throw new Error('This vehicle is already booked for another slot');
      }
      
      const startTime = new Date(bookingDate);
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + parseInt(bookingHours));
      
      const bookingData = {
        userId: user.uid,
        hostId: selectedHost,
        vehicleNumberPlate: selectedVehicle,
        parkingSlot: selectedSlot,
        startTime: Timestamp.fromDate(startTime),
        endTime: Timestamp.fromDate(endTime),
        hours: parseInt(bookingHours),
        status: 'active',
        createdAt: Timestamp.now()
      };
      
      const selectedVehicleData = vehicles.find(v => v.numberPlate === selectedVehicle);
      if (selectedVehicleData) {
        bookingData.vehicleDetails = {
          brandName: selectedVehicleData.brandName,
          modelName: selectedVehicleData.modelName,
          vehicleType: selectedVehicleData.vehicleType,
          visitorName: selectedVehicleData.visitorName
        };
      }
      
      const bookingRef = doc(collection(db, 'bookings'));
      await setDoc(bookingRef, bookingData);
      
      setActiveBookings([...activeBookings, {id: bookingRef.id, ...bookingData}]);
      setBookingSuccess(true);
      setShowBookingForm(false);
      
      setTimeout(() => {
        setBookingSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error('Booking error:', err);
      setBookingError(err.message);
    } finally {
      setBookingInProgress(false);
    }
  };
  
  const cancelBooking = async (bookingId) => {
    try {
      setIsLoading(true);
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        status: 'cancelled',
        updatedAt: Timestamp.now()
      });
      
      setActiveBookings(activeBookings.filter(booking => booking.id !== bookingId));
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setError('Failed to cancel booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const extendBooking = async (bookingId, additionalHours) => {
    try {
      setIsLoading(true);
      
      const bookingRef = doc(db, 'bookings', bookingId);
      const bookingSnapshot = await getDoc(bookingRef);
      
      if (!bookingSnapshot.exists()) {
        throw new Error('Booking not found');
      }
      
      const bookingData = bookingSnapshot.data();
      const currentEndTime = bookingData.endTime.toDate();
      const newEndTime = new Date(currentEndTime);
      newEndTime.setHours(newEndTime.getHours() + parseInt(additionalHours));
      
      await updateDoc(bookingRef, {
        endTime: Timestamp.fromDate(newEndTime),
        hours: bookingData.hours + parseInt(additionalHours),
        updatedAt: Timestamp.now()
      });
      
      const updatedBookings = activeBookings.map(booking => {
        if (booking.id === bookingId) {
          return {
            ...booking,
            endTime: newEndTime,
            hours: booking.hours + parseInt(additionalHours)
          };
        }
        return booking;
      });
      
      setActiveBookings(updatedBookings);
    } catch (err) {
      console.error('Error extending booking:', err);
      setError('Failed to extend booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-[#0066B1]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Welcome, {user?.displayName || 'Visitor'}</h2>
              <p className="text-gray-600 mt-2">Manage your parking vehicles here</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/dashboard/regform">
            <div className="flex items-center justify-center p-4 bg-[#0066B1] text-white rounded-lg hover:bg-[#0077CC] transition-colors cursor-pointer">
              <span>Register New Vehicle</span>
            </div>
          </Link>
          <button onClick={() => setShowBookingForm(true)} className="flex items-center justify-center p-4 bg-white text-[#0066B1] border-2 border-[#0066B1] rounded-lg hover:bg-gray-50 transition-colors hover:cursor-pointer" disabled={vehicles.length === 0}>
            <span>Book Parking Slot</span>
          </button>
        </div>
        
        {bookingSuccess && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">Parking slot booked successfully!</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button onClick={() => setBookingSuccess(false)} className="inline-flex rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600">
                    <span className="sr-only">Dismiss</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showBookingForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-blue-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Book a Parking Slot</h2>
              <button onClick={() => setShowBookingForm(false)} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {bookingError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{bookingError}</p>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Select Vehicle</label>
                <select  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" value={selectedVehicle || ''} onChange={(e) => setSelectedVehicle(e.target.value)} required>
                  <option value="">-- Select a vehicle --</option>
                  {vehicles.map((vehicle) => (
                    <option  key={vehicle.numberPlate}  value={vehicle.numberPlate} disabled={isVehicleBooked(vehicle.numberPlate)}>
                      {vehicle.brandName} {vehicle.modelName} ({vehicle.numberPlate})
                      {isVehicleBooked(vehicle.numberPlate) ? ' - Already Booked' : ''}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700">Select Parking Location</label>
                <select  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" value={selectedHost || ''} onChange={(e) => setSelectedHost(e.target.value)} required>
                  <option value="">-- Select a location --</option>
                  {parkingHosts.map((host) => (
                    <option key={host.id} value={host.id}>
                      {host.name} - {host.address} ({host.slots} slots)
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700">Entry Date & Time</label>
                <input type="datetime-local" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} min={new Date().toISOString().slice(0, 16)} required />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700">Duration (Hours)</label>
                <input type="number" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" value={bookingHours} onChange={(e) => setBookingHours(Math.max(1, parseInt(e.target.value) || 1))} min="1" max="24" required />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700">Select Parking Slot</label>
                <select  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" value={selectedSlot || ''} onChange={(e) => setSelectedSlot(e.target.value)} required  >
                  <option value="">-- Select a slot --</option>
                  {selectedHost && Array.from({length: 10}, (_, i) => (
                    <option key={i} value={`${selectedHost}-${i+1}`}>
                      Slot {i+1} {i < 3 ? '(Premium)' : i < 7 ? '(Standard)' : '(Economy)'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end">
                <button type="button" onClick={() => setShowBookingForm(false)} className="mr-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Cancel
                </button>
                <button type="submit" disabled={bookingInProgress} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#0066B1] hover:bg-[#0077CC] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" >
                  {bookingInProgress ? 'Processing...' : 'Book Now'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Active Bookings</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <div className="w-6 h-6 border-2 border-[#0066B1] border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2">Loading bookings...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 p-4 rounded-md">{error}</div>
          ) : activeBookings.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">You don&apos;t have any active parking bookings.</p>
              <button 
                onClick={() => setShowBookingForm(true)} 
                className="mt-4 inline-block px-6 py-2 bg-[#0066B1] text-white rounded-md hover:bg-[#0077CC] transition-all"
                disabled={vehicles.length === 0}
              >
                Book a Parking Slot
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slot</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activeBookings.map((booking) => {
                    const host = parkingHosts.find(h => h.id === booking.hostId) || { name: 'Unknown' };
                    return (
                      <tr key={booking.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0066B1]">
                          {booking.vehicleDetails ? 
                            `${booking.vehicleDetails.brandName} ${booking.vehicleDetails.modelName}` : 
                            booking.vehicleNumberPlate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{host.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{booking.parkingSlot.split('-')[1]}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDateTime(booking.startTime)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDateTime(booking.endTime)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{booking.hours}h</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 space-x-2">
                          <button 
                            onClick={() => extendBooking(booking.id, 1)} 
                            className="text-green-600 hover:text-green-800"
                          >
                            Extend +1h
                          </button>
                          <button 
                            onClick={() => cancelBooking(booking.id)} 
                            className="text-red-600 hover:text-red-800 ml-3"
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Registered Vehicles</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <div className="w-6 h-6 border-2 border-[#0066B1] border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2">Loading your vehicles...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 p-4 rounded-md">{error}</div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">You haven&apos;t registered any vehicles yet.</p>
              <Link href="/regform">
                <div className="mt-4 inline-block px-6 py-2 bg-[#0066B1] text-white rounded-md hover:bg-[#0077CC] transition-all">
                  Register Your First Vehicle
                </div>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number Plate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle.numberPlate}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0066B1]">{vehicle.numberPlate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{vehicle.brandName} {vehicle.modelName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{vehicle.visitorName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{vehicle.vehicleType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(vehicle.registeredAt)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {isVehicleBooked(vehicle.numberPlate) ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Currently Booked
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            Available
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

    
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Parking Information</h2>
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Regular Hours</span>
              <span className="text-gray-800">7:00 AM - 10:00 PM</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Max Duration</span>
              <span className="text-gray-800">8 hours</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Support Contact</span>
              <span className="text-[#0066B1]">mahaveer@gmail.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard