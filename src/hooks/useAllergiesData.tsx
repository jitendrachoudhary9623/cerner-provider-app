import { useState, useEffect } from 'react';
import axios from 'axios';
import { AllergyIntolerance } from 'fhir/r4';

export const useAllergiesData = (patientId: string | null, accessToken: string | null) => {
  const [allergies, setAllergies] = useState<AllergyIntolerance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllergies = async () => {
      if (!patientId || !accessToken) return;
      
      setLoading(true);
      try {
        const issuer = localStorage.getItem('issuer');

        const response = await axios.get(`${issuer}/AllergyIntolerance?patient=${patientId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
          },
        });

        const allergyEntries = response.data.entry || [];
        const fetchedAllergies: AllergyIntolerance[] = allergyEntries.map((entry: any) => entry.resource);
        setAllergies(fetchedAllergies);
      } catch (error) {
        console.error('Error fetching allergy data:', error);
      }
      setLoading(false);
    };

    fetchAllergies();
  }, [patientId, accessToken]);

  return { allergies, loading };
};
