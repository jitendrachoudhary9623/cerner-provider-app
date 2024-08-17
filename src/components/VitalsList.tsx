// components/VitalsList.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Vital {
  id: string;
  code: {
    coding: {
      display: string;
    }[];
  };
  valueQuantity: {
    value: number;
    unit: string;
  };
  effectiveDateTime: string;
}

interface VitalsListProps {
  patientId: string;
}

const VitalsList: React.FC<VitalsListProps> = ({ patientId }) => {
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVitals = async () => {
      setLoading(true);
      try {
        const accessToken = localStorage.getItem('access_token');
        const issuer = localStorage.getItem('issuer');
        const response = await axios.get(`${issuer}/Observation?patient=${patientId}&category=vital-signs`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
          }
        });
        setVitals(response.data.entry.map((e: any) => e.resource));
      } catch (error) {
        console.error('Error fetching vitals:', error);
      }
      setLoading(false);
    };

    fetchVitals();
  }, [patientId]);

  if (loading) {
    return <div>Loading vitals...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Vital Sign</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vitals.map((vital) => (
          <TableRow key={vital.id}>
            <TableCell>{vital.code.coding[0].display}</TableCell>
            <TableCell>{vital.valueQuantity.value} {vital.valueQuantity.unit}</TableCell>
            <TableCell>{new Date(vital.effectiveDateTime).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default VitalsList;