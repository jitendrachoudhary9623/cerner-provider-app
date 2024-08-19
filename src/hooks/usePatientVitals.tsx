import { useState, useEffect } from "react";
import { Observation } from "fhir/r4";
import axios from "axios";

export const usePatientVitals = (

) => {
  const [vitals, setVitals] = useState<Observation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getVitals = async () => {

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

        const allergyEntries = response.data.entry || [];
        const fetchedAllergies: Observation[] = allergyEntries.map(
          (entry: any) => entry.resource
        );
        const vitalsData = fetchedAllergies.filter(
          (med: Observation) => med.resourceType === "Observation"
        );

        setVitals(vitalsData);
      } catch (error) {
        console.error("Error fetching patient vitals:", error);
      }
      setLoading(false);
    };

    getVitals();
  }, []);

  return { vitals, loading };
};
