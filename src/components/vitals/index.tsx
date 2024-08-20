import React, { useState, useMemo } from 'react';
import { usePatientVitals } from '@/hooks/usePatientVitals';
import { Observation } from 'fhir/r4';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, 
         ComposedChart, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AddVitalsSheet from './AddVitalsSheet';
import axios from 'axios';
import { createHeartRateObservation, createBloodPressureObservation, createBodyTemperatureObservation, createRespiratoryRateObservation, createOxygenSaturationObservation, createBodyWeight, createBMI } from '@/lib/Vital.Helpers';

const Vitals: React.FC = () => {
  const { vitals, loading, refetch } = usePatientVitals();
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
      ...(vital.code?.text === 'Blood Pressure' && {
        systolic: vital.component?.find(c => c.code.text === 'Systolic')?.valueQuantity?.value,
        diastolic: vital.component?.find(c => c.code.text === 'Diastolic')?.valueQuantity?.value,
      })
    }));
  }, [filteredVitals]);

  const createObservation = async (value: { code: string, value: string, unit: string }) => {
    const accessToken = localStorage.getItem("access_token");
    const patientId = localStorage.getItem("patient");
    const issuer = localStorage.getItem("issuer");
  
    let observation: Observation;
  
    switch (value.code) {
      case 'blood-pressure':
        const [systolic, diastolic] = value.value.split('/').map(Number);
        observation = createBloodPressureObservation(patientId, systolic, diastolic);
        break;
      case 'heart-rate':
        observation = createHeartRateObservation(patientId, Number(value.value));
        break;
      case 'temperature':
        observation = createBodyTemperatureObservation(patientId, Number(value.value));
        break;
      case 'respiratory-rate':
        observation = createRespiratoryRateObservation(patientId, Number(value.value));
        break;
      case 'oxygen-saturation':
        observation = createOxygenSaturationObservation(patientId, Number(value.value));
        break;
      case 'body-weight':
        observation = createBodyWeight(patientId, Number(value.value));
        break;
      case 'bmi':
        observation = createBMI(patientId, Number(value.value));
        break;
      default:
        throw new Error(`Unsupported vital type: ${value.code}`);
    }
  
    const response = await axios.post<Observation>(`${issuer}/Observation`, observation, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });
  
    return response.data;
  };

  const handleAddVital = async (values) => {
    try {
      await Promise.all(values.map(createObservation));
      await refetch(); // Refresh the vitals data after adding new vitals
    } catch (error) {
      console.error("Error adding vital signs:", error);
      throw error; // Rethrow the error to be caught by AddVitalsSheet
    }
  };

  if (loading) {
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
          Loading vitals...
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
              {selectedVital === 'Blood Pressure' ? (
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVitals.map((vital, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(vital.effectiveDateTime).toLocaleDateString()}</TableCell>
                  <TableCell>{vital.code?.text}</TableCell>
                  <TableCell>
                    {vital.code?.text === 'Blood Pressure'
                      ? `${vital.component?.find(c => c.code.text === 'Systolic')?.valueQuantity?.value} / 
                         ${vital.component?.find(c => c.code.text === 'Diastolic')?.valueQuantity?.value}`
                      : vital.valueQuantity?.value}
                  </TableCell>
                  <TableCell>{vital.valueQuantity?.unit}</TableCell>
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