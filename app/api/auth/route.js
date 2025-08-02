import { NextResponse } from 'next/server';
import { auth, db } from '@/app/firebase/config';
import { doc, setDoc, getDoc, collection, getDocs, query, where, limit, orderBy } from 'firebase/firestore';

export async function GET(request) {
  try {
   
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');
    
    if (!uid) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }
  
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }
    
  
    let bookings = [];
    try {
      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('userId', '==', uid),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      
      const bookingsSnapshot = await getDocs(bookingsQuery);
      
      bookingsSnapshot.forEach(doc => {
        bookings.push({
          id: doc.id,
          ...doc.data()
        });
      });
    } catch (err) {
      console.error('Error fetching bookings:', err);

      if (err.message.includes('index')) {
        console.log('Please create the required index in Firebase console using the link in the error message');
      }
    }
    

    const vehiclesQuery = query(
      collection(db, 'users', uid, 'vehicle')
    );
    
    const vehiclesSnapshot = await getDocs(vehiclesQuery);
    const vehicles = [];
    
    vehiclesSnapshot.forEach(doc => {
      vehicles.push({
        id: doc.id,
        ...doc.data()
      });
    });
    

    return NextResponse.json({
      success: true,
      data: {
        user: {
          uid: userDoc.id,
          ...userDoc.data()
        },
        recentBookings: bookings,
        vehicles: vehicles
      }
    });
    
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { user } = data;

    if (!user || !user.uid) {
      return NextResponse.json({
        success: false,
        error: 'Invalid user data'
      }, { status: 400 });
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          name: user.displayName || '',
          email: user.email || '',
          phoneNumber: user.phoneNumber || '',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          uid: user.uid
        });

        console.log('New user created in Firestore:', user.uid);
      } else {
        await setDoc(userRef, {
          lastLogin: new Date().toISOString(),
          name: user.displayName || userDoc.data().name,
          email: user.email || userDoc.data().email,
          phoneNumber: user.phoneNumber || userDoc.data().phoneNumber
        }, { merge: true });

        console.log('Existing user updated in Firestore:', user.uid);
      }

      return NextResponse.json({
        success: true,
        user: {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          phoneNumber: user.phoneNumber
        }
      });

    } catch (firestoreError) {
      console.error('Firestore error:', firestoreError);
      return NextResponse.json({
        success: false,
        error: 'Failed to save user data to Firestore'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('General error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
