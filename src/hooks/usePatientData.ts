// hooks/usePatientData.ts
import { useState, useEffect, use } from 'react';
import axios from 'axios';
import { Patient } from 'fhir/r4';

export const usePatientData = () => {
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBanner, setShowBanner ]= useState(false);

  useEffect(() => {
    const fetchPatientData = async () => {
      setLoading(true);
      try {
        const accessToken = localStorage.getItem('access_token');
        const patientId = localStorage.getItem('patient');
        const issuer = localStorage.getItem('issuer');
        const response = await axios.get<Patient>(`${issuer}/Patient/${patientId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
          },
        });

        setPatientData(response.data);
        setShowBanner(localStorage.getItem("need_patient_banner") === "true");
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
      setLoading(false);
    };

    fetchPatientData();
  }, []);

  return { patientData, loading, showBanner };
};
