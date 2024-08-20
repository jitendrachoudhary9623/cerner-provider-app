import { useState, useEffect, useCallback } from "react";
import { Observation } from "fhir/r4";
import axios from "axios";

export const usePatientVitals = () => {
  const [vitals, setVitals] = useState<Observation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVitals = useCallback(async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      const patientId = localStorage.getItem("patient");
      const issuer = localStorage.getItem("issuer");
      const response = await axios.get(
        `${issuer}/Observation?patient=${patientId}&category=vital-signs&_sort=-date`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
        }
      );

      const vitalEntries = response.data.entry || [];
      const fetchedVitals: Observation[] = vitalEntries.map(
        (entry: any) => entry.resource
      );
      const vitalsData = fetchedVitals.filter(
        (med: Observation) => med.resourceType === "Observation"
      );

      setVitals(vitalsData);
    } catch (error) {
      console.error("Error fetching patient vitals:", error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchVitals();
  }, [fetchVitals]);

  const refetch = useCallback(() => {
    fetchVitals();
  }, [fetchVitals]);

  return { vitals, loading, refetch };
};