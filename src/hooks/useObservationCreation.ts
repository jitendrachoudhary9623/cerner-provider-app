import { useState } from 'react';
import axios from 'axios';
import { Observation } from 'fhir/r4';
import { createHeartRateObservation, createBloodPressureObservation, createBodyTemperatureObservation, createRespiratoryRateObservation, createOxygenSaturationObservation, createBodyWeight, createBMI } from '@/lib/Vital.Helpers';

interface ObservationValue {
  code: string;
  value: string;
  unit: string;
}

export const useObservationCreation = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createObservation = async (value: ObservationValue): Promise<Observation> => {
    setIsCreating(true);
    setError(null);

    try {
      const accessToken = localStorage.getItem("access_token");
      const patientId = localStorage.getItem("patient");
      const issuer = localStorage.getItem("issuer");

      let observation: Observation;

      switch (value.code) {
        case 'blood-pressure':
          const [systolic, diastolic] = value.value.split('/').map(Number);
          observation = createBloodPressureObservation(patientId, systolic, diastolic);
          break;
        case 'heart-rate':
          observation = createHeartRateObservation(patientId, Number(value.value));
          break;
        case 'temperature':
          observation = createBodyTemperatureObservation(patientId, Number(value.value));
          break;
        case 'respiratory-rate':
          observation = createRespiratoryRateObservation(patientId, Number(value.value));
          break;
        case 'oxygen-saturation':
          observation = createOxygenSaturationObservation(patientId, Number(value.value));
          break;
        case 'body-weight':
          observation = createBodyWeight(patientId, Number(value.value));
          break;
        case 'bmi':
          observation = createBMI(patientId, Number(value.value));
          break;
        default:
          throw new Error(`Unsupported vital type: ${value.code}`);
      }

      const response = await axios.post<Observation>(`${issuer}/Observation`, observation, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      });

      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  return { createObservation, isCreating, error };
};