// app/page.tsx
'use client';

import { useSmartLaunch } from '../hooks/useSmartLaunch';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiLoader } from 'react-icons/fi'; // Icons for status

export default function Home() {
  const { error } = useSmartLaunch();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 bg-white shadow-xl rounded-lg"
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-700">SMART on FHIR Launch</h1>
          <p className="text-gray-600 mt-2">
            {error ? 'Oops! Something went wrong.' : 'Connecting to your healthcare provider...'}
          </p>
        </div>
        <div className="flex justify-center items-center">
          {error ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center text-red-500"
            >
              <FiAlertCircle className="mr-2" size={24} />
              <p>{error}</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center text-green-500"
            >
              <FiLoader className="animate-spin mr-2" size={24} />
              <p>Please wait while we authenticate...</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
