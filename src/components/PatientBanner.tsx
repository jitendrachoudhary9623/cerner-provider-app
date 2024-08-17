// components/PatientBanner.tsx
import { User } from 'lucide-react';

interface PatientBannerProps {
  patient: {
    name: { text: string }[];
    gender: string;
    birthDate: string;
    id: string;
  };
}

const PatientBanner: React.FC<PatientBannerProps> = ({ patient }) => {
  return (
    <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4 rounded shadow-md">
      <div className="flex items-center">
        <User className="h-12 w-12 text-blue-500 mr-4" />
        <div>
          <h2 className="text-xl font-bold">{patient.name[0].text}</h2>
          <p className="text-sm">
            <span className="font-semibold">Gender:</span> {patient.gender} | 
            <span className="font-semibold ml-2">DOB:</span> {patient.birthDate} | 
            <span className="font-semibold ml-2">ID:</span> {patient.id}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientBanner;