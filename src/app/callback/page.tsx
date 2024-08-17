// app/callback/page.tsx
'use client';

import { FiLoader, FiAlertCircle } from 'react-icons/fi';
import { useSmartFhirCallbackHandler } from '../../hooks/useSmartFhirCallbackHandler';

export default function Callback() {
  const { loading, error, debugInfo } = useSmartFhirCallbackHandler();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="text-center">
          <FiLoader className="animate-spin text-blue-500 text-4xl mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-blue-700">Processing Authorization</h1>
          <p className="text-gray-600">We are exchanging the authorization code for an access token. Please wait...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="text-center">
          <FiAlertCircle className="text-red-500 text-4xl mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-red-700">Callback Error</h1>
          <p className="text-gray-600">{error}</p>
          <div className="bg-white shadow-md rounded p-4 mt-4">
            <h2 className="text-lg font-medium text-gray-800">Debug Information</h2>
            <pre className="text-xs text-left text-gray-700 mt-2 whitespace-pre-wrap">{debugInfo}</pre>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
