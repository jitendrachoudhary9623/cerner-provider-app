import React from 'react';
import { PractitionerRole } from 'fhir/r4';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

interface GeneralPractitionersProps {
  practitioners: PractitionerRole[];
}

const GeneralPractitioners: React.FC<GeneralPractitionersProps> = ({ practitioners }) => (
  <Card className="col-span-3 p-6 rounded-lg border border-gray-200">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-800">General Practitioners</h3>
      <Button variant="ghost" size="sm"><Plus className="h-4 w-4 text-gray-400" /></Button>
    </div>
    <Table>
      <TableHeader>
        <TableRow>
        <TableHead className="font-medium text-gray-500">Id</TableHead>
          <TableHead className="font-medium text-gray-500">Name</TableHead>
          <TableHead className="font-medium text-gray-500">Specialty</TableHead>
          <TableHead className="font-medium text-gray-500">Reference</TableHead>

        </TableRow>
      </TableHeader>
      <TableBody>
        {practitioners.map((gp, index) => (
          <TableRow key={index}>
            <TableCell>{gp?.id || ""}</TableCell>
            <TableCell>{gp?.display || ""}</TableCell>
            <TableCell>General Practitioner</TableCell>
            <TableCell>{gp?.reference || ""}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Card>
);

export default GeneralPractitioners;
