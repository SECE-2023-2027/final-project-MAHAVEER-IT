import { NextResponse } from 'next/server';
import { auth, db } from '@/app/firebase/config';
import { doc, updateDoc } from 'firebase/firestore';

export async function POST(request) {
  try {
    const data = await request.json();
    const { uid, updates } = data;

    if (!uid || !updates) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request data'
      }, { status: 400 });
    }


    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, updates);

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
