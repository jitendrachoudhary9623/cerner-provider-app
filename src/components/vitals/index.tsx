import React, { useState, useMemo } from 'react';
import { usePatientVitals } from '@/hooks/usePatientVitals';
import { useObservationCreation } from '@/hooks/useObservationCreation';
import { motion } from 'framer-motion';
import AddVitalsSheet from './AddVitalsSheet';
import VitalsChart from './VitalsChart';
import VitalsTable from './VitalsTable';
import LoadingView from './LoadingView';
import NoDataView from './NoDataView';

const Vitals: React.FC = () => {
  const { vitals, loading: fetchingVitals, refetch } = usePatientVitals();
  const { createObservation } = useObservationCreation();
  const [selectedVital, setSelectedVital] = useState('all');
  const [isAddingVitals, setIsAddingVitals] = useState(false);

  const filteredVitals = useMemo(() => {
    if (selectedVital === 'all') return vitals;
    return vitals.filter(vital => vital?.code?.text === selectedVital);
  }, [vitals, selectedVital]);

  const uniqueVitalTypes = useMemo(() => 
    ['all', ...new Set(vitals?.map(vital => vital?.code?.text))],
    [vitals]
  );

  const handleAddVital = async (newVitals) => {
    setIsAddingVitals(true);
    try {
      const observations = newVitals.map(vital => ({
        code: {
          coding: [{
            system: "http://loinc.org",
            code: vital.code,
            display: vital.name
          }],
          text: vital.name
        },
        valueQuantity: {
          value: vital.code === 'blood-pressure' ? parseFloat(vital.value.split('/')[0]) : parseFloat(vital.value),
          unit: vital.unit
        },
        ...(vital.code === 'blood-pressure' && {
          component: [
            {
              code: {
                coding: [{
                  system: "http://loinc.org",
                  code: "8480-6",
                  display: "Systolic Blood Pressure"
                }]
              },
              valueQuantity: {
                value: parseFloat(vital.value.split('/')[0]),
                unit: "mmHg"
              }
            },
            {
              code: {
                coding: [{
                  system: "http://loinc.org",
                  code: "8462-4",
                  display: "Diastolic Blood Pressure"
                }]
              },
              valueQuantity: {
                value: parseFloat(vital.value.split('/')[1]),
                unit: "mmHg"
              }
            }
          ]
        })
      }));

      await Promise.all(observations.map(createObservation));
      await refetch();
    } catch (error) {
      console.error("Error adding vital signs:", error);
      throw error;
    } finally {
      setIsAddingVitals(false);
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

      {isAddingVitals && (
        <div className="text-center py-4">
          <p className="text-lg font-semibold text-blue-600">Adding new vitals...</p>
        </div>
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