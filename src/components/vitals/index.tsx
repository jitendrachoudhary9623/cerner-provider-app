import React, { useState, useMemo } from 'react';
import { usePatientVitals } from '@/hooks/usePatientVitals';
import { Observation } from 'fhir/r4';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, 
         ComposedChart, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AddVitalsSheet from './AddVitalsSheet';  // Import the new component

const Vitals: React.FC = () => {
  const { vitals, loading } = usePatientVitals();
  const [newVital, setNewVital] = useState({ code: '', value: '', unit: '' });
  const [selectedVital, setSelectedVital] = useState('all');

  const filteredVitals = useMemo(() => {
    if (selectedVital === 'all') return vitals;
    return vitals.filter(vital => vital.code?.text === selectedVital);
  }, [vitals, selectedVital]);

  const uniqueVitalTypes = useMemo(() => 
    ['all', ...new Set(vitals.map(vital => vital.code?.text))],
    [vitals]
  );

  const chartData = useMemo(() => {
    return filteredVitals.map(vital => ({
      date: new Date(vital.effectiveDateTime).toLocaleDateString(),
      value: vital.valueQuantity?.value,
      code: vital.code?.text,
      ...(vital.code?.text === 'Blood Pressure' && {
        systolic: vital.component?.find(c => c.code.text === 'Systolic')?.valueQuantity?.value,
        diastolic: vital.component?.find(c => c.code.text === 'Diastolic')?.valueQuantity?.value,
      })
    }));
  }, [filteredVitals]);

  const handleAddVital = (values) => {
    console.log({
        values
    })
     // make api call
    console.log('Adding new vital:', newVital);
    setNewVital({ code: '', value: '', unit: '' });
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-64"
      >
        <div className="text-2xl font-semibold text-gray-600">Loading vitals...</div>
      </motion.div>
    );
  }

  if (!vitals || vitals.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-64"
      >
        <div className="text-2xl font-semibold text-gray-600">No vitals data available.</div>
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