import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Patient } from 'fhir/r4';

export const usePatientData = () => {
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBanner, setShowBanner] = useState(false);
  const fetchAttemptedRef = useRef(false);

  const fetchPatientData = useCallback(async () => {
    if (fetchAttemptedRef.current) return;
    fetchAttemptedRef.current = true;

    setLoading(true);
    try {
      const accessToken = localStorage.getItem('access_token');
      const patientId = localStorage.getItem('patient');
      const issuer = localStorage.getItem('issuer');

      if (!accessToken || !patientId || !issuer) {
        throw new Error('Missing required data for fetching patient information');
      }

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
      // Optionally, you could set an error state here to display to the user
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatientData();
  }, [fetchPatientData]);

  return { patientData, loading, showBanner };
};