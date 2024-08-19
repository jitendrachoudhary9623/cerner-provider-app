import React from 'react';
import { Patient } from 'fhir/r4';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil } from 'lucide-react';

interface ContactInformationProps {
  patient: Patient;
}

const ContactInformation: React.FC<ContactInformationProps> = ({ patient }) => (
  <Card className="p-6 rounded-lg border border-gray-200">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
      <Button variant="ghost" size="sm"><Pencil className="h-4 w-4 text-gray-400" /></Button>
    </div>
    <Table>
      <TableBody>
        <TableRow>
          <TableCell className="py-2 pl-0 font-medium text-gray-500">Address</TableCell>
          <TableCell className="py-2">{patient.address?.[0]?.line?.[0]}, {patient.address?.[0]?.city}, {patient.address?.[0]?.state} {patient.address?.[0]?.postalCode}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="py-2 pl-0 font-medium text-gray-500">Phone (Home)</TableCell>
          <TableCell className="py-2">{patient.telecom?.find(t => t.system === 'phone' && t.use === 'home')?.value}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="py-2 pl-0 font-medium text-gray-500">Phone (Mobile)</TableCell>
          <TableCell className="py-2">{patient.telecom?.find(t => t.system === 'phone' && t.use === 'mobile')?.value}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="py-2 pl-0 font-medium text-gray-500">Email</TableCell>
          <TableCell className="py-2">{patient.telecom?.find(t => t.system === 'email')?.value}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </Card>
);

export default ContactInformation;
