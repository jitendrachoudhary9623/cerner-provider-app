import { useState } from 'react';
import axios from 'axios';
import { Observation } from 'fhir/r4';
import {
  createHeartRateObservation,
  createBloodPressureObservation,
  createBodyTemperatureObservation,
  createRespiratoryRateObservation,
  createOxygenSaturationObservation,
  createBodyWeight,
  createBMI
} from '@/lib/Vital.Helpers';

interface VitalData {
  code: string;
  name: string;
  value: string;
  unit: string;
  effectiveDateTime: Date;
}

export const useObservationCreation = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createObservations = async (newVitals: VitalData[]): Promise<Observation[]> => {
    setIsCreating(true);
    setError(null);

    try {
      const accessToken = localStorage.getItem("access_token");
      const patientId = localStorage.getItem("patient");
      const issuer = localStorage.getItem("issuer");

      if (!accessToken || !patientId || !issuer) {
        throw new Error("Missing required authentication information");
      }

      const observations = newVitals.map(vital => {
        const value = parseFloat(vital.value);
        const date = new Date(vital.effectiveDateTime);

        switch (vital.code) {
          case 'heart-rate':
            return createHeartRateObservation(patientId, value, date);
          case 'blood-pressure':
            const [systolic, diastolic] = vital.value.split('/').map(Number);
            return createBloodPressureObservation(patientId, systolic, diastolic, date);
          case 'temperature':
            return createBodyTemperatureObservation(patientId, value, date);
          case 'respiratory-rate':
            return createRespiratoryRateObservation(patientId, value, date);
          case 'oxygen-saturation':
            return createOxygenSaturationObservation(patientId, value, date);
          case 'body-weight':
            return createBodyWeight(patientId, value, date);
          case 'bmi':
            return createBMI(patientId, value, date);
          default:
            throw new Error(`Unsupported vital type: ${vital.code}`);
        }
      });

      console.log({ observations });

      const responses = await Promise.all(observations.map(observation =>
        axios.post<Observation>(`${issuer}/Observation`, observation, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
          },
        })
      ));

      return responses.map(response => response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(new Error(errorMessage));
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  return { createObservations, isCreating, error };
};