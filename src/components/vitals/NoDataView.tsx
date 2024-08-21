import React from 'react';
import { motion } from 'framer-motion';
import AddVitalsSheet from './AddVitalsSheet';

const NoDataView = ({ onAddVitals }: { onAddVitals: Function }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center h-64"
  >
    <div className="flex justify-between items-center w-full px-4">
      <h2 className="text-3xl font-bold">Patient Vitals</h2>
      <div className="ml-auto">
        <AddVitalsSheet onAddVitals={onAddVitals} />
      </div>
    </div>
    <div className="text-2xl font-semibold text-gray-600 mt-4">
      No vitals data available.
    </div>
  </motion.div>
);

export default NoDataView;