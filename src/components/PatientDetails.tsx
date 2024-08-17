import React, { useState } from 'react';
import { Patient } from 'fhir/r4';
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, User, Info, Calendar, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

interface PatientDetailsProps {
  patient: Patient;
}

const PatientDetails: React.FC<PatientDetailsProps> = ({ patient }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => setShowDetails(!showDetails);

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

  const getMRN = () => {
    const mrn = patient.identifier?.find(id => id.type?.coding?.[0]?.code === "MR");
    return mrn?.value || 'N/A';
  };

  const nameCount = patient.name?.length || 0;
  const primaryName = patient.name?.[0];
  const otherNames = patient.name?.slice(1).map(name => `${name.given?.join(' ')} ${name.family}`).join(', ');

  return (
    <TooltipProvider>
      <motion.div 
        className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-lg shadow-lg border border-gray-200"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <motion.div 
              className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 text-xl font-bold mr-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {primaryName?.given?.[0]?.[0]}{primaryName?.family?.[0]}
            </motion.div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 tracking-wide">
                {primaryName?.given?.join(' ')} {primaryName?.family}
              </h2>
              <div className="flex items-center text-sm text-gray-700 mt-1 space-x-3">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-blue-500" />
                  {getAge(patient.birthDate!)} y.o.
                </span>
                <span className="flex items-center">
                  <User className="w-4 h-4 mr-1 text-blue-500" />
                  {patient.gender}
                </span>
                <span className="flex items-center">
                  <Globe className="w-4 h-4 mr-1 text-blue-500" />
                  MRN: {getMRN()}
                </span>
              </div>
            </div>
          </div>
          <Tooltip>
            <TooltipTrigger>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none hover:from-blue-600 hover:to-blue-700 rounded-lg shadow-md px-4 py-2"
                >
                  Generate Report
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              Generate a detailed report for this patient
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="text-sm text-gray-700 mb-4">
          <span className="font-semibold">Summary:</span> {primaryName?.given?.[0]} {primaryName?.family}, {getAge(patient.birthDate!)} years old, {patient.gender}. MRN: {getMRN()}.
        </div>
        <motion.div
          onClick={toggleDetails}
          className="flex items-center text-blue-500 cursor-pointer mb-4"
        >
          {showDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          <span className="ml-2">{showDetails ? "Hide Details" : "Show Details"}</span>
        </motion.div>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center text-sm">
                  <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                  <span>{patient.address?.[0]?.line?.[0]}, {patient.address?.[0]?.city}, {patient.address?.[0]?.state} {patient.address?.[0]?.postalCode}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="w-5 h-5 mr-2 text-gray-500" />
                  <span>{patient.telecom?.find(t => t.system === 'phone' && t.use === 'home')?.value}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Mail className="w-5 h-5 mr-2 text-gray-500" />
                  <span>{patient.telecom?.find(t => t.system === 'email')?.value}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="text-sm">
                  <span className="font-semibold">Preferred Language:</span> {patient.communication?.find(comm => comm.preferred)?.language?.text}
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Race:</span> {patient.extension?.find(ext => ext.url === "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race")?.extension?.find(ext => ext.url === "text")?.valueString}
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Ethnicity:</span> {patient.extension?.find(ext => ext.url === "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity")?.extension?.find(ext => ext.url === "text")?.valueString}
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Marital Status:</span> {patient.maritalStatus?.text}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </TooltipProvider>
  );
};

export default PatientDetails;
