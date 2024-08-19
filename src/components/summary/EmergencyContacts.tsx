import React from 'react';
import { PatientContact } from 'fhir/r4';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

interface EmergencyContactsProps {
  contacts: PatientContact[];
}

const EmergencyContacts: React.FC<EmergencyContactsProps> = ({ contacts }) => (
  <Card className="col-span-3 p-6 rounded-lg border border-gray-200">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-800">Emergency Contacts</h3>
      <Button variant="ghost" size="sm"><Plus className="h-4 w-4 text-gray-400" /></Button>
    </div>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="font-medium text-gray-500">Name</TableHead>
          <TableHead className="font-medium text-gray-500">Relationship</TableHead>
          <TableHead className="font-medium text-gray-500">Phone</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.map((contact, index) => (
          <TableRow key={index}>
            <TableCell>{contact.name?.text}</TableCell>
            <TableCell>{contact.relationship?.[0]?.text}</TableCell>
            <TableCell>{contact.telecom?.find(t => t.system === 'phone')?.value || 'N/A'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Card>
);

export default EmergencyContacts;
