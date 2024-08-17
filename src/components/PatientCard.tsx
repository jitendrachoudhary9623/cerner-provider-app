// components/PatientCard.tsx
import React from 'react';
import { Patient } from 'fhir/r4';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Plus } from 'lucide-react';

interface PatientCardProps {
  patient: Patient;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient }) => {
  const getAge = (birthDate: string) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const m = today.getMonth() - birthDateObj.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <img src="/placeholder-avatar.png" alt="Patient" className="w-16 h-16 rounded-full mr-4" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">{patient.name?.[0]?.given?.join(' ')} {patient.name?.[0]?.family}</h2>
              <p className="text-gray-600">
                {getAge(patient.birthDate!)} y.o. ({patient.birthDate}), {patient.gender}
              </p>
            </div>
          </div>
          <Button variant="outline" className="text-gray-600 border-gray-300">
            Generate Patient Report
          </Button>
        </div>

        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="flex space-x-1 border-b border-gray-200">
            <TabsTrigger value="summary" className="px-4 py-2 -mb-px text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300">Summary</TabsTrigger>
            <TabsTrigger value="allergies" className="px-4 py-2 -mb-px text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300">Allergies</TabsTrigger>
            <TabsTrigger value="immunization" className="px-4 py-2 -mb-px text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300">Immunization</TabsTrigger>
            <TabsTrigger value="medication" className="px-4 py-2 -mb-px text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300">Medication</TabsTrigger>
            <TabsTrigger value="diagnosis" className="px-4 py-2 -mb-px text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300">Diagnosis</TabsTrigger>
            <TabsTrigger value="family-history" className="px-4 py-2 -mb-px text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300">Family History</TabsTrigger>
            <TabsTrigger value="documents" className="px-4 py-2 -mb-px text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300">Documents</TabsTrigger>
            <TabsTrigger value="self-assessment" className="px-4 py-2 -mb-px text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300">Self Assessment Results</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="pt-6">
            <div className="grid grid-cols-3 gap-6">
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
                      <TableCell className="py-2 font-medium text-gray-500">Phone</TableCell>
                      <TableCell className="py-2 text-blue-600">{patient.telecom?.find(t => t.system === 'phone')?.value}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="py-2 pl-0 font-medium text-gray-500">Gender</TableCell>
                      <TableCell className="py-2">{patient.gender}</TableCell>
                      <TableCell className="py-2 font-medium text-gray-500">Email</TableCell>
                      <TableCell className="py-2 text-blue-600">{patient.telecom?.find(t => t.system === 'email')?.value}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="py-2 pl-0 font-medium text-gray-500">Date of birth</TableCell>
                      <TableCell className="py-2">{patient.birthDate}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Card>

              <Card className="p-6 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Social Habits</h3>
                  <Button variant="ghost" size="sm"><Pencil className="h-4 w-4 text-gray-400" /></Button>
                </div>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="py-2 pl-0 font-medium text-gray-500">Alcohol</TableCell>
                      <TableCell className="py-2">Current some day</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="py-2 pl-0 font-medium text-gray-500">Tobacco</TableCell>
                      <TableCell className="py-2">Former</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="py-2 pl-0 font-medium text-gray-500">Drugs</TableCell>
                      <TableCell className="py-2">Current some day</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="py-2 pl-0 font-medium text-gray-500">Occupation</TableCell>
                      <TableCell className="py-2">designer</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="py-2 pl-0 font-medium text-gray-500">Travel</TableCell>
                      <TableCell className="py-2">Current status unknown</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Card>

              <Card className="col-span-3 p-6 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Appointments</h3>
                  <Button variant="ghost" size="sm"><Plus className="h-4 w-4 text-gray-400" /></Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-medium text-gray-500">Provider Name</TableHead>
                      <TableHead className="font-medium text-gray-500">Date</TableHead>
                      <TableHead className="font-medium text-gray-500">Time slot</TableHead>
                      <TableHead className="font-medium text-gray-500">Visit Reason</TableHead>
                      <TableHead className="font-medium text-gray-500">Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="py-3">
                        <div className="flex items-center">
                          <img src="/placeholder-avatar.png" alt="Provider" className="w-8 h-8 rounded-full mr-2" />
                          Black, Marvin
                        </div>
                      </TableCell>
                      <TableCell className="py-3">11/7/21</TableCell>
                      <TableCell className="py-3">9:30am-9:45am</TableCell>
                      <TableCell className="py-3">Right hand</TableCell>
                      <TableCell className="py-3">
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">History</span>
                      </TableCell>
                      <TableCell className="py-3">...</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="py-3">
                        <div className="flex items-center">
                          <img src="/placeholder-avatar.png" alt="Provider" className="w-8 h-8 rounded-full mr-2" />
                          Brooklyn Simmons
                        </div>
                      </TableCell>
                      <TableCell className="py-3">11/7/21</TableCell>
                      <TableCell className="py-3">10:30am-10:45am</TableCell>
                      <TableCell className="py-3">Reason</TableCell>
                      <TableCell className="py-3">
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Unsuccess</span>
                      </TableCell>
                      <TableCell className="py-3">...</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Card>

              <Card className="p-6 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Emergency Contact</h3>
                  <Button variant="ghost" size="sm"><Pencil className="h-4 w-4 text-gray-400" /></Button>
                </div>
                <p className="font-medium">Debra Black (Mother)</p>
                <p className="text-blue-600">213-222-2222</p>
                <p className="text-blue-600">debra.black@example.com</p>
              </Card>
            </div>
          </TabsContent>

          {/* Add other TabsContent for remaining tabs */}
        </Tabs>
      </div>
    </div>
  );
};

export default PatientCard;