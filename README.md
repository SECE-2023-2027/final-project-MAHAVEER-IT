# Visitor Parking Management System

A modern, efficient parking management solution built with Next.js and Firebase, designed to streamline visitor parking operations with real-time booking and comprehensive vehicle management.

🔗 **Live Demo**: [https://visitor-parking-tracker.vercel.app/](https://visitor-parking-tracker.vercel.app/)

## 🚀 Features

### 🔐 Authentication System
- **Google Sign-in Integration** - Seamless authentication using Firebase Auth
- **User Profile Management** - Persistent user data and profile customization
- **Secure Session Handling** - Protected routes and user state management

### 🚗 Vehicle Registration
- **Comprehensive Vehicle Details** - Brand, model, and type registration
- **License Plate Validation** - Smart validation for accurate plate numbers
- **Visitor Information Management** - Complete visitor detail tracking
- **Multiple Vehicle Support** - Register and manage multiple vehicles per user

### 🅿️ Smart Parking Management
- **Real-time Slot Booking** - Available slots with date/time selection
- **Multiple Slot Types**:
  - 🌟 Premium - Enhanced amenities and prime locations
  - 🔹 Standard - Regular parking with standard features
  - 💰 Economy - Budget-friendly parking options
- **Active Booking Management** - View and modify current reservations
- **Booking History** - Complete record of past parking sessions

### 👤 User Profile Dashboard
- **Personal Information Management** - Edit and update user details
- **Booking Analytics** - Track parking usage and history
- **Account Settings** - Comprehensive account management tools

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.4.4 | React framework with SSR and API routes |
| **Tailwind CSS** | Latest | Utility-first CSS framework |
| **Firebase** | Latest | Backend services suite |
| **React Hook Form** | Latest | Optimized form handling |

### Firebase Services
- **Authentication** - Google OAuth integration
- **Firestore Database** - NoSQL document database for data storage
- **Hosting** - Deployed via Vercel with Firebase backend

## ⚡ Performance Optimizations

### Form Optimization
- **React Hook Form Integration** - Minimizes re-renders and improves form performance
- **Built-in Validation** - Client-side validation with custom error messaging
- **Efficient State Management** - Optimized form state handling

### Database Optimization
- **Efficient Query Structure** - Optimized Firestore queries for faster data retrieval
- **Data Caching** - Strategic caching for improved load times
- **Minimal Data Transfer** - Only necessary data fetched per request

### Application Performance
- **Next.js App Router** - Optimized routing with server components
- **Bundle Optimization** - Reduced CSS bundle size with Tailwind CSS
- **Image Optimization** - Next.js built-in image optimization



## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project setup

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/visitor-parking-management.git
   cd visitor-parking-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Firebase Configuration**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication with Google provider
   - Set up Firestore Database
   - Configure security rules

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)



## 🚢 Deployment

The application is deployed on Vercel. To deploy your own instance:

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Set Environment Variables**
   Add your Firebase configuration to Vercel environment variables

3. **Deploy**
   ```bash
   vercel --prod
   ```


**⭐ Star this repository if you found it helpful!**
