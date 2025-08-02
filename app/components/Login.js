'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { auth } from '@/app/firebase/config'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'

function Login() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true)
            setError('')

            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)

            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user: {
                        uid: result.user.uid,
                        email: result.user.email,
                        displayName: result.user.displayName,
                        phoneNumber: result.user.phoneNumber
                    }
                })
            })

            const data = await response.json()

            if (data.success) {
                router.push('/dashboard')
            } else {
                setError(data.error || 'Failed to complete signup. Please try again.')
            }
        } catch (error) {
            console.error('Login error:', error)
            setError('Failed to sign in. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="mb-6">
                        <Image src="/racing.png" alt="VPT Logo" width={80} height={80} className="mx-auto" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
                    <p className="mt-2 text-gray-600">Sign in to manage your parking spaces</p>
                </div>

                <div className="bg-[#F6F6F6] rounded-xl p-8 shadow-lg space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full bg-white px-6 py-4 rounded-md shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-3 group disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer">
                        {!loading && (
                            <Image src="/google.png" alt="Google Logo" width={24} height={24} />
                        )}
                        <span className="text-gray-700 font-medium group-hover:text-[#0066B1] transition-colors">
                            {loading ? 'Signing in...' : 'Continue with Google'}
                        </span>
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-[#F6F6F6] text-gray-500">Protected by</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-center space-x-2 text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0066B1]" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">Secure authentication</span>
                    </div>
                </div>

                <div className="text-center space-y-2">
                    <p className="text-sm text-gray-500">
                        By continuing, you agree to our{' '}
                        <a href="#" className="text-[#0066B1] hover:underline">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-[#0066B1] hover:underline">Privacy Policy</a>
                    </p>
                    <p className="text-sm text-gray-500">
                        Need help?{' '}
                        <a href="#" className="text-[#0066B1] hover:underline">Contact Support</a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login