import React, { useState, useMemo } from 'react';
import { usePatientVitals } from '@/hooks/usePatientVitals';
import { useObservationCreation } from '@/hooks/useObservationCreation';
import { motion } from 'framer-motion';
import AddVitalsSheet from './AddVitalsSheet';
import VitalsChart from './VitalsChart';
import VitalsTable from './VitalsTable';
import LoadingView from './LoadingView';
import NoDataView from './NoDataView';
import { Alert, AlertDescription } from "@/components/ui/alert";

const Vitals: React.FC = () => {
  const { vitals, loading: fetchingVitals, refetch } = usePatientVitals();
  const { createObservations, isCreating, error: creationError } = useObservationCreation();
  const [selectedVital, setSelectedVital] = useState('all');
  const [error, setError] = useState<string | null>(null);

  const filteredVitals = useMemo(() => {
    if (selectedVital === 'all') return vitals;
    return vitals.filter(vital => vital?.code?.text === selectedVital);
  }, [vitals, selectedVital]);

  const uniqueVitalTypes = useMemo(() => 
    ['all', ...new Set(vitals?.map(vital => vital?.code?.text))],
    [vitals]
  );

  const handleAddVital = async (newVitals) => {
    setError(null);
    try {
      await createObservations(newVitals);
      await refetch();
    } catch (err) {
      console.error("Error adding vital signs:", err);
      setError("Failed to add vital signs. Please try again.");
    }
  };

  if (fetchingVitals) {
    return <LoadingView />;
  }

  if (!vitals || vitals.length === 0) {
    return <NoDataView onAddVitals={handleAddVital} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Patient Vitals</h2>
        <AddVitalsSheet onAddVitals={handleAddVital} />
      </div>

      {isCreating && (
        <div className="text-center py-4">
          <p className="text-lg font-semibold text-blue-600">Adding new vitals...</p>
        </div>
      )}

      {(error || creationError) && (
        <Alert variant="destructive">
          <AlertDescription>{error || creationError.message}</AlertDescription>
        </Alert>
      )}

      <VitalsChart
        filteredVitals={filteredVitals}
        selectedVital={selectedVital}
        setSelectedVital={setSelectedVital}
        uniqueVitalTypes={uniqueVitalTypes}
      />

      <VitalsTable filteredVitals={filteredVitals} />
    </motion.div>
  );
};

export default Vitals;