import { NextResponse } from 'next/server';
import { db } from '@/app/firebase/config';
import { doc, setDoc, getDoc, collection, getDocs, query } from 'firebase/firestore';

export async function GET(request) {
  try {
  
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');
    
    if (!uid) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required',
      }, { status: 400 });
    }
   
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
      }, { status: 404 });
    }

    const vehiclesRef = collection(db, 'users', uid, 'vehicle');
    const vehiclesSnapshot = await getDocs(query(vehiclesRef));

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
        vehicles
      }
    });
    
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { user, vehicleData } = data;

    if (!user || !user.uid) {
      return NextResponse.json({
        success: false,
        error: 'Invalid user data',
      }, { status: 400 });
    }

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
    } else {
      await setDoc(userRef, {
        lastLogin: new Date().toISOString(),
        name: user.displayName || userDoc.data().name,
        email: user.email || userDoc.data().email,
        phoneNumber: user.phoneNumber || userDoc.data().phoneNumber
      }, { merge: true });
    }

   
    if (!vehicleData || !vehicleData.numberPlate) {
      return NextResponse.json({
        success: false,
        error: 'Invalid vehicle data',
      }, { status: 400 });
    }

    const vehicleRef = doc(collection(db, 'users', user.uid, 'vehicle'), vehicleData.numberPlate);
    await setDoc(vehicleRef, {
      ...vehicleData,
      registeredAt: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: 'User and vehicle data saved successfully'
    });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
