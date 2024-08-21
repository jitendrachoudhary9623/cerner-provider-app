import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PlusCircle, Info, Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { vitalOptions } from './vitalOptions';

interface Vital {
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
  const [vitals, setVitals] = useState<Vital[]>([{ code: '', name: '', value: '', unit: '', effectiveDateTime: new Date() }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleAddVital = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback([]);
    try {
      const validVitals = vitals.filter(v => v.code && v.value);
      if (validVitals.length === 0) {
        throw new Error('No valid vitals to add');
      }
      await onAddVitals(validVitals);
      setFeedback(validVitals.map(v => `Created ${v.name} vital`));
      setVitals([{ code: '', name: '', value: '', unit: '', effectiveDateTime: new Date() }]);
      setIsOpen(false);
    } catch (error) {
      console.error('Error creating vitals', error);
      setFeedback([(error as Error).message || 'Error creating vitals. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVitalChange = (index: number, field: keyof Vital, value: string | Date) => {
    const newVitals = [...vitals];
    if (field === 'effectiveDateTime' && value instanceof Date) {
      newVitals[index][field] = value;
    } else if (typeof value === 'string') {
      newVitals[index][field as keyof Omit<Vital, 'effectiveDateTime'>] = value;
    }
    if (field === 'code') {
      const selectedVital = vitalOptions.find(v => v.code === value);
      if (selectedVital) {
        newVitals[index].name = selectedVital.name;
        newVitals[index].unit = selectedVital.unit;
        if (selectedVital.inputType === 'dual') {
          newVitals[index].value = '/';
        } else {
          newVitals[index].value = '';
        }
      }
    }
    setVitals(newVitals);
  };

  const addNewVitalField = () => {
    setVitals([...vitals, { code: '', name: '', value: '', unit: '', effectiveDateTime: new Date() }]);
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

  const getInsights = (vital: Vital) => {
    const selectedVital = vitalOptions.find(v => v.code === vital.code);
    return selectedVital?.insights || [];
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
                      {vitalOptions.find(v => v.code === vital.code)?.inputType === 'dual' ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            id={`systolic-${index}`}
                            type="number"
                            placeholder="Systolic"
                            value={vital.value.split('/')[0]}
                            onChange={(e) => handleVitalChange(index, 'value', `${e.target.value}/${vital.value.split('/')[1]}`)}
                          />
                          <span>/</span>
                          <Input
                            id={`diastolic-${index}`}
                            type="number"
                            placeholder="Diastolic"
                            value={vital.value.split('/')[1]}
                            onChange={(e) => handleVitalChange(index, 'value', `${vital.value.split('/')[0]}/${e.target.value}`)}
                          />
                        </div>
                      ) : (
                        <Input
                          id={`value-${index}`}
                          type="number"
                          placeholder="Enter value"
                          value={vital.value}
                          onChange={(e) => handleVitalChange(index, 'value', e.target.value)}
                        />
                      )}
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
                  <div>
                    <Label htmlFor={`effectiveDateTime-${index}`}>Date</Label>
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
                          onSelect={(date) => date && handleVitalChange(index, 'effectiveDateTime', date)}
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
            <Button type="button" onClick={addNewVitalField} className="w-full" disabled={isSubmitting}>
              <PlusCircle className="mr-2" />
              Add Another Vital
            </Button>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Vitals...
                </>
              ) : (
                'Add Vitals'
              )}
            </Button>
          </SheetFooter>
        </form>
        {feedback.length > 0 && (
          <Alert className="mt-4">
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