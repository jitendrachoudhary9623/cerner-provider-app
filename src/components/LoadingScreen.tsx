// components/LoadingScreen.tsx
import React from 'react';
import { FiLoader } from 'react-icons/fi';

interface LoadingScreenProps {
  message: string;
}

export default function LoadingScreen({ message }: LoadingScreenProps) {
  return (
    <div className="relative flex flex-col justify-center items-center h-screen bg-gradient-to-r from-blue-100 to-blue-300">
      {/* Background Animation */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="bg-blue-200 rounded-full h-96 w-96 animate-pulse"></div>
      </div>

      {/* Loading Spinner */}
      <FiLoader className="animate-spin text-blue-600 text-6xl mb-4 relative z-10" />
      
      {/* Loading Message */}
      <p className="text-xl font-semibold text-gray-700 relative z-10">{message}</p>

      {/* Optional Progress Bar */}
      <div className="relative z-10 mt-4 w-64 h-2 bg-gray-300 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 animate-loading-bar"></div>
      </div>
    </div>
  );
}
