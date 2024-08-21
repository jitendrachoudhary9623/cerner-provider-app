import { useState, useEffect, useCallback, useRef } from "react";
import { Observation } from "fhir/r4";
import axios from "axios";

export const usePatientVitals = () => {
  const [vitals, setVitals] = useState<Observation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchAttemptedRef = useRef(false);

  const fetchVitals = useCallback(async (force = false) => {
    if (fetchAttemptedRef.current && !force) return;
    fetchAttemptedRef.current = true;

    setLoading(true);
    setError(null);

    try {
      const accessToken = localStorage.getItem("access_token");
      const patientId = localStorage.getItem("patient");
      const issuer = localStorage.getItem("issuer");

      if (!accessToken || !patientId || !issuer) {
        throw new Error("Missing required data for fetching patient vitals");
      }

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
        (vital: Observation) => vital.resourceType === "Observation"
      );

      setVitals(vitalsData);
    } catch (error) {
      console.error("Error fetching patient vitals:", error);
      setError("Failed to fetch patient vitals. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVitals();
  }, [fetchVitals]);

  const refetch = useCallback(() => {
    fetchVitals(true);
  }, [fetchVitals]);

  return { vitals, loading, error, refetch };
};