import React from 'react';
import { Patient } from 'fhir/r4';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil } from 'lucide-react';

interface PrimaryInformationProps {
  patient: Patient;
}

const PrimaryInformation: React.FC<PrimaryInformationProps> = ({ patient }) => (
  <Card className="col-span-2 p-6 rounded-lg border border-gray-200">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-800">Primary Information</h3>
      <Button variant="ghost" size="sm"><Pencil className="h-4 w-4 text-gray-400" /></Button>
    </div>
    <Table>
      <TableBody>
        <TableRow>
          <TableCell className="py-2 pl-0 font-medium text-gray-500">Name</TableCell>
          <TableCell className="py-2">{patient.name?.[0]?.given?.join(' ')} {patient.name?.[0]?.family}</TableCell>
          <TableCell className="py-2 font-medium text-gray-500">MRN</TableCell>
          <TableCell className="py-2">{patient.identifier?.find(id => id.type?.coding?.[0]?.code === "MR")?.value}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="py-2 pl-0 font-medium text-gray-500">Gender</TableCell>
          <TableCell className="py-2">{patient.gender}</TableCell>
          <TableCell className="py-2 font-medium text-gray-500">Date of Birth</TableCell>
          <TableCell className="py-2">{patient.birthDate}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="py-2 pl-0 font-medium text-gray-500">Marital Status</TableCell>
          <TableCell className="py-2">{patient.maritalStatus?.text}</TableCell>
          <TableCell className="py-2 font-medium text-gray-500">Preferred Language</TableCell>
          <TableCell className="py-2">{patient.communication?.find(comm => comm.preferred)?.language?.text}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="py-2 pl-0 font-medium text-gray-500">Race</TableCell>
          <TableCell className="py-2">{patient.extension?.find(ext => ext.url === "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race")?.extension?.find(ext => ext.url === "text")?.valueString}</TableCell>
          <TableCell className="py-2 font-medium text-gray-500">Ethnicity</TableCell>
          <TableCell className="py-2">{patient.extension?.find(ext => ext.url === "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity")?.extension?.find(ext => ext.url === "text")?.valueString}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </Card>
);

export default PrimaryInformation;
