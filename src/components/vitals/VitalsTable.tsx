import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface VitalSign {
  effectiveDateTime: string;
  code: {
    text: string;
  };
  valueQuantity?: {
    value: number;
    unit: string;
  };
  component?: {
    code: {
      coding: {
        display: string;
      }[];
    };
    valueQuantity: {
      value: number;
    };
  }[];
  performer?: {
    reference: string;
  }[];
}

interface VitalsTableProps {
  filteredVitals: VitalSign[];
}

const VitalsTable: React.FC<VitalsTableProps> = ({ filteredVitals }) => {
  const [expandedRowIndex, setExpandedRowIndex] = useState<number | null>(null);

  const handleRowClick = (index: number) => {
    setExpandedRowIndex(expandedRowIndex === index ? null : index);
  };

  const isAbnormalVital = (vital: VitalSign) => {
    if (vital.code.text === 'Blood pressure') {
      const systolic = vital.component?.find(c => c.code.coding[0].display === 'Systolic Blood Pressure')?.valueQuantity?.value;
      const diastolic = vital.component?.find(c => c.code.coding[0].display === 'Diastolic Blood Pressure')?.valueQuantity?.value;
      return systolic && diastolic && (systolic > 140 || diastolic > 90);
    }
    return false;
  };

  return (
    <TooltipProvider>
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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVitals.map((vital, index) => (
                <>
                  <TableRow
                    key={index}
                    onClick={() => handleRowClick(index)}
                    style={{
                      backgroundColor: isAbnormalVital(vital) ? '#ffe5e5' : 'inherit',
                      cursor: 'pointer'
                    }}
                  >
                    <TableCell>
                      {new Date(vital.effectiveDateTime).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Tooltip content={`Details about ${vital.code?.text}`}>
                        {vital.code?.text}
                      </Tooltip>
                    </TableCell>
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
                    <TableCell>
                      <Button variant="link" onClick={() => handleRowClick(index)}>
                        {expandedRowIndex === index ? 'Hide Details' : 'Show Details'}
                      </Button>
                    </TableCell>
                  </TableRow>
                  {expandedRowIndex === index && (
                    <TableRow key={`expanded-${index}`}>
                      <TableCell colSpan={6}>
                        {/* Additional details and insights can be displayed here */}
                        <div>
                          <strong>Additional Information:</strong>
                          <p>Trend over last 5 readings...</p>
                          {/* Example: Charts or graphs can be added here */}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default VitalsTable;
