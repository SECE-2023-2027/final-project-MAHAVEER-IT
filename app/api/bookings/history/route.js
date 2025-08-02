import { NextResponse } from 'next/server';
import { db } from '@/app/firebase/config';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

export async function GET(request) {
  try {

    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');
    const limitParam = searchParams.get('limit') || 10; 
    
    if (!uid) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }
    
    
    let bookings = [];
    
    try {
   
      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('userId', '==', uid),
        orderBy('createdAt', 'desc'),
        limit(parseInt(limitParam))
      );
      
      const bookingsSnapshot = await getDocs(bookingsQuery);
      
      bookingsSnapshot.forEach(doc => {
        const data = doc.data();
        const booking = { id: doc.id, ...data };
        
        
        if (data.startTime && typeof data.startTime.toDate === 'function') {
          booking.startTime = {
            seconds: data.startTime.seconds,
            nanoseconds: data.startTime.nanoseconds
          };
        }
        
        if (data.endTime && typeof data.endTime.toDate === 'function') {
          booking.endTime = {
            seconds: data.endTime.seconds,
            nanoseconds: data.endTime.nanoseconds
          };
        }
        
        if (data.createdAt && typeof data.createdAt.toDate === 'function') {
          booking.createdAt = {
            seconds: data.createdAt.seconds,
            nanoseconds: data.createdAt.nanoseconds
          };
        }
        
        if (data.updatedAt && typeof data.updatedAt.toDate === 'function') {
          booking.updatedAt = {
            seconds: data.updatedAt.seconds,
            nanoseconds: data.updatedAt.nanoseconds
          };
        }
        
        bookings.push(booking);
      });
      
    } catch (queryError) {
      console.error('Error executing query:', queryError);
      
      
      if (queryError.message && queryError.message.includes('index')) {
        console.log('Missing index. Create the required index using the link in the error message.');
        
      
        try {
          const simpleQuery = query(
            collection(db, 'bookings'),
            where('userId', '==', uid),
            limit(parseInt(limitParam))
          );
          
          const simpleSnapshot = await getDocs(simpleQuery);
          
          simpleSnapshot.forEach(doc => {
            const data = doc.data();
            const booking = { id: doc.id, ...data };
            
            
            if (data.startTime && typeof data.startTime.toDate === 'function') {
              booking.startTime = {
                seconds: data.startTime.seconds,
                nanoseconds: data.startTime.nanoseconds
              };
            }
            
            if (data.endTime && typeof data.endTime.toDate === 'function') {
              booking.endTime = {
                seconds: data.endTime.seconds,
                nanoseconds: data.endTime.nanoseconds
              };
            }
            
            if (data.createdAt && typeof data.createdAt.toDate === 'function') {
              booking.createdAt = {
                seconds: data.createdAt.seconds,
                nanoseconds: data.createdAt.nanoseconds
              };
            }
            
            if (data.updatedAt && typeof data.updatedAt.toDate === 'function') {
              booking.updatedAt = {
                seconds: data.updatedAt.seconds,
                nanoseconds: data.updatedAt.nanoseconds
              };
            }
            
            bookings.push(booking);
          });
          
          
          bookings.sort((a, b) => {
           
            if (a.createdAt && b.createdAt) {
              return b.createdAt.seconds - a.createdAt.seconds;
            }
            return 0;
          });
          
        } catch (fallbackError) {
          console.error('Fallback query also failed:', fallbackError);
        }
      }
    }
    

    return NextResponse.json({
      success: true,
      data: bookings
    });
    
  } catch (error) {
    console.error('Error fetching booking history:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch booking history'
    }, { status: 500 });
  }
}
