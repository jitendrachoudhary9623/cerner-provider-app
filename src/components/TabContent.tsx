// components/TabContent.tsx
import React from 'react';
import { Patient, PractitionerRole } from 'fhir/r4';
import PrimaryInformation from './summary/PrimaryInformation';
import ContactInformation from './summary/ContactInformation';
import EmergencyContacts from './summary/EmergencyContacts';
import GeneralPractitioners from './summary/GeneralPractitioners';
import Allergies from './allergy';
import Vitals from './vitals';
interface TabContentProps {
  activeTab: string;
  patient: Patient;
}

const TabContent: React.FC<TabContentProps> = ({ activeTab, patient }) => {
    const getEmergencyContacts = () => {
      return patient.contact?.filter(c => c.relationship?.[0]?.coding?.[0]?.display === "Family Member") || [];
    };
  
    const getGeneralPractitioners = () => {
      return patient.generalPractitioner?.map((reference) => reference as PractitionerRole) || [];
    };
  
  switch (activeTab) {
    case 'summary':
        return (
            <div className="p-6">
            <div className="grid grid-cols-3 gap-6">
              <PrimaryInformation patient={patient} />
              <ContactInformation patient={patient} />
              <EmergencyContacts contacts={getEmergencyContacts()} />
              <GeneralPractitioners practitioners={getGeneralPractitioners()} />
            </div>
          </div>
        );
    case 'vitals':
        return <Vitals />;
    case 'allergies':
      return <Allergies />;

    case 'immunization':
      return (
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Immunization</h3>
          <p>Immunization records will be displayed here.</p>
        </div>
      );

    case 'medication':
      return (
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Medication</h3>
          <p>Current medications and medication history will be displayed here.</p>
        </div>
      );

    case 'diagnosis':
      return (
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Diagnosis</h3>
          <p>Patient diagnoses will be displayed here.</p>
        </div>
      );

    case 'family-history':
      return (
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Family History</h3>
          <p>Family medical history will be displayed here.</p>
        </div>
      );

    case 'documents':
      return (
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Documents</h3>
          <p>Patient documents and records will be listed here.</p>
        </div>
      );

    case 'self-assessment':
      return (
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Self Assessment Results</h3>
          <p>Patient self-assessment results will be displayed here.</p>
        </div>
      );

    default:
      return <div>No content available for this tab.</div>;
  }
};

export default TabContent;