import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PlusCircle, Info } from "lucide-react";

interface Vital {
  code: string;
  name: string;
  value: string;
  unit: string;
}

interface AddVitalsSheetProps {
  onAddVitals: (vitals: Vital[]) => void;
}

const vitalOptions = [
  { code: 'blood-pressure', name: 'Blood Pressure', unit: 'mmHg', normalRange: { min: 90, max: 120 }, insights: ['Indicates the force of blood against artery walls', 'Important for cardiovascular health'] },
  { code: 'heart-rate', name: 'Heart Rate', unit: 'bpm', normalRange: { min: 60, max: 100 }, insights: ['Measures how many times your heart beats per minute', 'Can indicate fitness level and stress'] },
  { code: 'temperature', name: 'Temperature', unit: '°C', normalRange: { min: 36.1, max: 37.2 }, insights: ['Core body temperature', 'Can indicate infection or illness'] },
  { code: 'respiratory-rate', name: 'Respiratory Rate', unit: 'breaths/min', normalRange: { min: 12, max: 20 }, insights: ['Number of breaths taken per minute', 'Can indicate respiratory or cardiac issues'] },
  { code: 'oxygen-saturation', name: 'Oxygen Saturation', unit: '%', normalRange: { min: 95, max: 100 }, insights: ['Percentage of oxygen in the blood', 'Important for overall health and organ function'] },
];

const AddVitalsSheet: React.FC<AddVitalsSheetProps> = ({ onAddVitals }) => {
  const [vitals, setVitals] = useState<Vital[]>([{ code: '', name: '', value: '', unit: '' }]);

  const handleAddVital = (e: React.FormEvent | undefined) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    onAddVitals(vitals.filter(v => v.code && v.value));
    setVitals([{ code: '', name: '', value: '', unit: '' }]);
  };
  

  const handleVitalChange = (index: number, field: keyof Vital, value: string) => {
    const newVitals = [...vitals];
    newVitals[index][field] = value;
    if (field === 'code') {
      const selectedVital = vitalOptions.find(v => v.code === value);
      if (selectedVital) {
        newVitals[index].name = selectedVital.name;
        newVitals[index].unit = selectedVital.unit;
      }
    }
    setVitals(newVitals);
  };

  const addNewVitalField = () => {
    setVitals([...vitals, { code: '', name: '', value: '', unit: '' }]);
  };

  const isVitalValueNormal = (vital: Vital) => {
    const selectedVital = vitalOptions.find(v => v.code === vital.code);
    if (selectedVital && selectedVital.normalRange) {
      const value = parseFloat(vital.value);
      return value >= selectedVital.normalRange.min && value <= selectedVital.normalRange.max;
    }
    return null;
  };

  const getInsights = (vital: Vital) => {
    const selectedVital = vitalOptions.find(v => v.code === vital.code);
    return selectedVital?.insights || [];
  };

  const getNormalRangeMessage = (vital: Vital) => {
    const selectedVital = vitalOptions.find(v => v.code === vital.code);
    if (!selectedVital) return '';

    if (parseFloat(vital.value) < selectedVital.normalRange.min) {
      return `Value is below the normal range of ${selectedVital.normalRange.min} - ${selectedVital.normalRange.max} ${selectedVital.unit}`;
    }

    if (parseFloat(vital.value) > selectedVital.normalRange.max) {
      return `Value is above the normal range of ${selectedVital.normalRange.min} - ${selectedVital.normalRange.max} ${selectedVital.unit}`;
    }

    return `Value is within the normal range of ${selectedVital.normalRange.min} - ${selectedVital.normalRange.max} ${selectedVital.unit}`;
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Add Vitals</Button>
      </SheetTrigger>
      <SheetContent className="w-[500px] sm:w-[600px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Add New Vitals</SheetTitle>
          <SheetDescription>Enter the details for the new vital signs</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleAddVital} className="flex flex-col flex-grow">
          <ScrollArea className="flex-grow pr-4">
            <div className="space-y-6 pb-6">
              {vitals.map((vital, index) => (
                <div key={index} className="space-y-4 pb-6 border-b">
                  <Select
                    value={vital.code}
                    onValueChange={(value) => handleVitalChange(index, 'code', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vital sign" />
                    </SelectTrigger>
                    <SelectContent>
                      {vitalOptions.map((option) => (
                        <SelectItem key={option.code} value={option.code}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex space-x-4">
                    <div className="flex-grow">
                      <Label htmlFor={`value-${index}`}>Value</Label>
                      <Input
                        id={`value-${index}`}
                        type="number"
                        placeholder="e.g., 120"
                        value={vital.value}
                        onChange={(e) => handleVitalChange(index, 'value', e.target.value)}
                      />
                    </div>
                    <div className="w-1/3">
                      <Label htmlFor={`unit-${index}`}>Unit</Label>
                      <Input
                        id={`unit-${index}`}
                        value={vital.unit}
                        readOnly
                      />
                    </div>
                  </div>
                  {vital.code && vital.value && (
                    <Alert>
                      <AlertDescription>
                        <div className={`flex items-center ${isVitalValueNormal(vital) ? "text-green-600" : "text-red-600"}`}>
                          <Info className="mr-2" />
                          {getNormalRangeMessage(vital)}
                        </div>
                        <ul className="list-disc pl-5 mt-2">
                          {getInsights(vital).map((insight, i) => (
                            <li key={i} className="text-sm text-gray-600">{insight}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
          <SheetFooter className="flex flex-col gap-2 mt-4">
            <Button type="button" onClick={addNewVitalField} className="w-full">
              <PlusCircle className="mr-2" />
              Add Another Vital
            </Button>
            <Button type="submit" className="w-full">Add Vitals</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default AddVitalsSheet;
