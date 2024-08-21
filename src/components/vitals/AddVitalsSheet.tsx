import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PlusCircle, Info, Loader2, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { vitalOptions } from './vitalOptions';

interface Vital {
  id: string;
  code: string;
  name: string;
  value: string;
  unit: string;
  effectiveDateTime: Date;
}

interface AddVitalsSheetProps {
  onAddVitals: (vitals: Vital[]) => Promise<void>;
}

const AddVitalsSheet: React.FC<AddVitalsSheetProps> = ({ onAddVitals }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [vitals, setVitals] = useState<Vital[]>([{ id: Date.now().toString(), code: '', name: '', value: '', unit: '', effectiveDateTime: new Date() }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string[]>([]);

  const isVitalValid = (vital: Vital) => vital.code && vital.value && vital.effectiveDateTime;
  const areAllVitalsValid = vitals.every(isVitalValid);
  const canSubmit = vitals.length > 0 && areAllVitalsValid;

  const handleAddVital = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback([]);
    try {
      const validVitals = vitals.filter(isVitalValid);
      if (validVitals.length === 0) {
        throw new Error('No valid vitals to add');
      }
      await onAddVitals(validVitals);
      setFeedback(validVitals.map(v => `Created ${v.name} vital`));
      setVitals([{ id: Date.now().toString(), code: '', name: '', value: '', unit: '', effectiveDateTime: new Date() }]);
      setIsOpen(false);
    } catch (error) {
      console.error('Error creating vitals', error);
      setFeedback([(error as Error).message || 'Error creating vitals. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVitalChange = (id: string, field: keyof Vital, value: string | Date) => {
    setVitals(prevVitals => prevVitals.map(vital => {
      if (vital.id === id) {
        if (field === 'effectiveDateTime' && value instanceof Date) {
          return { ...vital, [field]: value };
        } else if (typeof value === 'string') {
          const updatedVital = { ...vital, [field]: value };
          if (field === 'code') {
            const selectedVital = vitalOptions.find(v => v.code === value);
            if (selectedVital) {
              updatedVital.name = selectedVital.name;
              updatedVital.unit = selectedVital.unit;
              updatedVital.value = selectedVital.inputType === 'dual' ? '/' : '';
            }
          }
          return updatedVital;
        }
      }
      return vital;
    }));
  };

  const addNewVitalField = () => {
    setVitals([...vitals, { id: Date.now().toString(), code: '', name: '', value: '', unit: '', effectiveDateTime: new Date() }]);
  };

  const removeVital = (id: string) => {
    setVitals(prevVitals => prevVitals.filter(vital => vital.id !== id));
  };

  const isVitalValueNormal = (vital: Vital) => {
    const selectedVital = vitalOptions.find(v => v.code === vital.code);
    if (selectedVital && selectedVital.normalRange) {
      if (selectedVital.inputType === 'dual') {
        const [systolic, diastolic] = vital.value.split('/').map(Number);
        return systolic >= selectedVital.normalRange.systolic.min && 
               systolic <= selectedVital.normalRange.systolic.max &&
               diastolic >= selectedVital.normalRange.diastolic.min && 
               diastolic <= selectedVital.normalRange.diastolic.max;
      } else {
        const value = parseFloat(vital.value);
        return value >= selectedVital.normalRange.min && value <= selectedVital.normalRange.max;
      }
    }
    return null;
  };

  const getNormalRangeMessage = (vital: Vital) => {
    const selectedVital = vitalOptions.find(v => v.code === vital.code);
    if (!selectedVital) return '';

    if (selectedVital.inputType === 'dual') {
      const [systolic, diastolic] = vital.value.split('/').map(Number);
      const systolicRange = `${selectedVital.normalRange.systolic.min} - ${selectedVital.normalRange.systolic.max}`;
      const diastolicRange = `${selectedVital.normalRange.diastolic.min} - ${selectedVital.normalRange.diastolic.max}`;
      
      if (systolic < selectedVital.normalRange.systolic.min || diastolic < selectedVital.normalRange.diastolic.min) {
        return `Value is below the normal range of ${systolicRange}/${diastolicRange} ${selectedVital.unit}`;
      }
      if (systolic > selectedVital.normalRange.systolic.max || diastolic > selectedVital.normalRange.diastolic.max) {
        return `Value is above the normal range of ${systolicRange}/${diastolicRange} ${selectedVital.unit}`;
      }
      return `Value is within the normal range of ${systolicRange}/${diastolicRange} ${selectedVital.unit}`;
    } else {
      const value = parseFloat(vital.value);
      if (value < selectedVital.normalRange.min) {
        return `Value is below the normal range of ${selectedVital.normalRange.min} - ${selectedVital.normalRange.max} ${selectedVital.unit}`;
      }
      if (value > selectedVital.normalRange.max) {
        return `Value is above the normal range of ${selectedVital.normalRange.min} - ${selectedVital.normalRange.max} ${selectedVital.unit}`;
      }
      return `Value is within the normal range of ${selectedVital.normalRange.min} - ${selectedVital.normalRange.max} ${selectedVital.unit}`;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>Add Vitals</Button>
      </SheetTrigger>
      <SheetContent className="w-[500px] sm:w-[600px] flex flex-col p-0">
        <SheetHeader className="px-6 py-4">
          <SheetTitle>Add New Vitals</SheetTitle>
          <SheetDescription>Enter the details for the new vital signs</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleAddVital} className="flex flex-col h-full">
          <ScrollArea className="flex-grow px-6">
            <div className="space-y-6 pb-24">
              {vitals.map((vital) => (
                <div key={vital.id} className="space-y-4 pb-6 relative">
                    <div className="flex justify-between items-center mb-2">
                    <Label htmlFor={`vital-${vital.id}`} className="text-sm font-medium">
                      Vital Sign
                    </Label>
                    <span
                      onClick={() => removeVital(vital.id)}
                      className="text-red-500 hover:text-red-700 cursor-pointer text-sm"
                    >
                      Delete
                    </span>
                  </div>
                  <Select
                    value={vital.code}
                    onValueChange={(value) => handleVitalChange(vital.id, 'code', value)}
                  >
                    <SelectTrigger className="w-full">
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
                      <Label htmlFor={`value-${vital.id}`}>Value</Label>
                      {vitalOptions.find(v => v.code === vital.code)?.inputType === 'dual' ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            id={`systolic-${vital.id}`}
                            type="number"
                            placeholder="Systolic"
                            value={vital.value.split('/')[0]}
                            onChange={(e) => handleVitalChange(vital.id, 'value', `${e.target.value}/${vital.value.split('/')[1]}`)}
                          />
                          <span>/</span>
                          <Input
                            id={`diastolic-${vital.id}`}
                            type="number"
                            placeholder="Diastolic"
                            value={vital.value.split('/')[1]}
                            onChange={(e) => handleVitalChange(vital.id, 'value', `${vital.value.split('/')[0]}/${e.target.value}`)}
                          />
                        </div>
                      ) : (
                        <Input
                          id={`value-${vital.id}`}
                          type="number"
                          placeholder="Enter value"
                          value={vital.value}
                          onChange={(e) => handleVitalChange(vital.id, 'value', e.target.value)}
                        />
                      )}
                    </div>
                    <div className="w-1/3">
                      <Label htmlFor={`unit-${vital.id}`}>Unit</Label>
                      <Input
                        id={`unit-${vital.id}`}
                        value={vital.unit}
                        readOnly
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor={`effectiveDateTime-${vital.id}`}>Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !vital.effectiveDateTime && "text-muted-foreground"
                          )}
                        >
                          {vital.effectiveDateTime ? (
                            format(vital.effectiveDateTime, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={vital.effectiveDateTime}
                          onSelect={(date) => date && handleVitalChange(vital.id, 'effectiveDateTime', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  {vital.code && vital.value && (
                    <Alert>
                      <AlertDescription>
                        <div className={`flex items-center ${isVitalValueNormal(vital) ? "text-green-600" : "text-red-600"}`}>
                          <Info className="mr-2" />
                          {getNormalRangeMessage(vital)}
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="px-6 py-4 border-t bg-background sticky bottom-0 left-0 right-0">
            <Button type="button" onClick={addNewVitalField} className="w-full mb-2" disabled={isSubmitting}>
              <PlusCircle className="mr-2" />
              Add Another Vital
            </Button>
            <Button type="submit" className="w-full" disabled={isSubmitting || !canSubmit}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Vitals...
                </>
              ) : (
                'Add Vitals'
              )}
            </Button>
          </div>
        </form>
        {feedback.length > 0 && (
          <Alert className="m-6 mt-0">
            <AlertDescription>
              <ul className="list-disc pl-5">
                {feedback.map((message, index) => (
                  <li key={index}>{message}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default AddVitalsSheet;