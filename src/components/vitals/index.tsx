import React, { useState, useMemo } from 'react';
import { usePatientVitals } from '@/hooks/usePatientVitals';
import { useObservationCreation } from '@/hooks/useObservationCreation';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, 
         ComposedChart, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AddVitalsSheet from './AddVitalsSheet';

const Vitals: React.FC = () => {
  const { vitals, loading, refetch } = usePatientVitals();
  const { createObservation, isCreating, error } = useObservationCreation();
  const [selectedVital, setSelectedVital] = useState('all');

  const filteredVitals = useMemo(() => {
    if (selectedVital === 'all') return vitals;
    return vitals.filter(vital => vital?.code?.text === selectedVital);
  }, [vitals, selectedVital]);

  const uniqueVitalTypes = useMemo(() => 
    ['all', ...new Set(vitals?.map(vital => vital?.code?.text))],
    [vitals]
  );

  const chartData = useMemo(() => {
    return filteredVitals?.map(vital => ({
      date: new Date(vital?.effectiveDateTime).toLocaleDateString(),
      value: vital?.valueQuantity?.value,
      code: vital?.code?.text,
      ...(vital.code?.text === 'Blood pressure' && {
        systolic: vital.component?.find(c => c.code.coding[0].display === 'Systolic Blood Pressure')?.valueQuantity?.value,
        diastolic: vital.component?.find(c => c.code.coding[0].display === 'Diastolic Blood Pressure')?.valueQuantity?.value,
      })
    }));
  }, [filteredVitals]);

  const handleAddVital = async (values) => {
    try {
      await Promise.all(values.map(createObservation));
      await refetch(); // Refresh the vitals data after adding new vitals
    } catch (error) {
      console.error("Error adding vital signs:", error);
      throw error; // Rethrow the error to be caught by AddVitalsSheet
    }
  };

  if (loading || isCreating) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-64"
      >
        <div className="flex justify-between items-center w-full px-4">
          <h2 className="text-3xl font-bold">Patient Vitals</h2>
          <div className="ml-auto">
            <AddVitalsSheet onAddVitals={handleAddVital} />
          </div>
        </div>
        <div className="text-2xl font-semibold text-gray-600 mt-4">
          {loading ? 'Loading vitals...' : 'Adding new vitals...'}
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-64"
      >
        <div className="text-2xl font-semibold text-red-600 mt-4">
          Error: {error.message}
        </div>
      </motion.div>
    );
  }

  if (!vitals || vitals.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-64"
      >
        <div className="flex justify-between items-center w-full px-4">
          <h2 className="text-3xl font-bold">Patient Vitals</h2>
          <div className="ml-auto">
            <AddVitalsSheet onAddVitals={handleAddVital} />
          </div>
        </div>
        <div className="text-2xl font-semibold text-gray-600 mt-4">
          No vitals data available.
        </div>
      </motion.div>
    );
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

      <Card>
        <CardHeader>
          <CardTitle>Vitals Chart</CardTitle>
          <CardDescription>Select a vital sign to view its trend</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select onValueChange={setSelectedVital} defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select vital" />
              </SelectTrigger>
              <SelectContent>
                {uniqueVitalTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              {selectedVital === 'Blood pressure' ? (
                <ComposedChart data={chartData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="systolic" stroke="#8884d8" name="Systolic" />
                  <Line type="monotone" dataKey="diastolic" stroke="#82ca9d" name="Diastolic" />
                </ComposedChart>
              ) : (
                <LineChart data={chartData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vitals Table</CardTitle>
          <CardDescription>Detailed view of all recorded vital signs</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Vital Sign</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Performer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVitals.map((vital, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(vital.effectiveDateTime).toLocaleDateString()}</TableCell>
                  <TableCell>{vital.code?.text}</TableCell>
                  <TableCell>
                    {vital.code?.text === 'Blood pressure'
                      ? `${vital.component?.find(c => c.code.coding[0].display === 'Systolic Blood Pressure')?.valueQuantity?.value} / 
                         ${vital.component?.find(c => c.code.coding[0].display === 'Diastolic Blood Pressure')?.valueQuantity?.value}`
                      : vital.valueQuantity?.value}
                  </TableCell>
                  <TableCell>
                    {vital.code?.text === 'Blood pressure'
                      ? 'mmHg'
                      : vital.valueQuantity?.unit}
                  </TableCell>
                  <TableCell>
                    {vital.performer?.[0]?.reference.split('/')[1] || 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Vitals;