import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface VitalSign {
  effectiveDateTime: string;
  code: {
    text: string;
  };
  valueQuantity?: {
    value: number;
  };
  component?: {
    code: {
      coding: {
        display: string;
      }[];
    };
    valueQuantity: {
      value: number;
    };
  }[];
}

interface VitalsChartProps {
  filteredVitals: VitalSign[];
  selectedVital: string;
  setSelectedVital: (value: string) => void;
  uniqueVitalTypes: string[];
}

const colors = {
  'Heart rate': '#FF6384',
  'Respiratory rate': '#36A2EB',
  'Body temperature': '#FFCE56',
  'Blood pressure': '#4BC0C0',
  'Oxygen saturation': '#9966FF',
};

const VitalsChart: React.FC<VitalsChartProps> = ({
    filteredVitals,
    selectedVital,
    setSelectedVital,
    uniqueVitalTypes
  }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);
  
    const chartData = filteredVitals
      .map((vital) => ({
        date: new Date(vital.effectiveDateTime).getTime(),
        value: vital.valueQuantity?.value,
        code: vital.code.text,
        systolic: vital.component?.find(c => c.code.coding[0].display === 'Systolic Blood Pressure')?.valueQuantity?.value,
        diastolic: vital.component?.find(c => c.code.coding[0].display === 'Diastolic Blood Pressure')?.valueQuantity?.value,
      }))
      .sort((a, b) => a.date - b.date);
  
    useEffect(() => {
      if (chartRef.current && selectedVital === 'Blood pressure') {
        try {
          const chart = createChart(chartRef.current, {
            width: chartRef.current.clientWidth,
            height: 400,
            layout: {
              background: { type: ColorType.Solid, color: 'white' },
            },
          });
  
          const candleSeries = chart.addCandlestickSeries({
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
          });
  
          const systolicSeries = chart.addLineSeries({
            color: '#FF4136',
            lineWidth: 2,
          });
  
          const diastolicSeries = chart.addLineSeries({
            color: '#0074D9',
            lineWidth: 2,
          });
  
          const data = chartData
            .filter(item => item.systolic != null && item.diastolic != null)
            .map(item => ({
              time: item.date / 1000,
              open: item.diastolic,
              high: item.systolic,
              low: item.diastolic,
              close: item.systolic,
            }));
  
          candleSeries.setData(data);
          systolicSeries.setData(data.map(item => ({ time: item.time, value: item.high })));
          diastolicSeries.setData(data.map(item => ({ time: item.time, value: item.low })));
  
          chart.timeScale().fitContent();
  
          const legend = document.createElement('div');
          legend.style.position = 'absolute';
          legend.style.left = '12px';
          legend.style.top = '12px';
          legend.style.zIndex = '1';
          legend.style.font = '12px sans-serif';
          legend.innerHTML = `
            <div style="color: #FF4136;">— Systolic</div>
            <div style="color: #0074D9;">— Diastolic</div>
            <div>█ Range</div>
          `;
          chartRef.current.appendChild(legend);
  
          setError(null);
  
          return () => {
            chart.remove();
            if (chartRef.current && chartRef.current.contains(legend)) {
              chartRef.current.removeChild(legend);
            }
          };
        } catch (err) {
          console.error('Error creating blood pressure chart:', err);
          setError('Failed to create the blood pressure chart. Please try again or select a different vital sign.');
        }
      }
    }, [selectedVital, chartData]);
  
    const renderChartExplanation = () => {
      if (selectedVital === 'Blood pressure') {
        return (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <h4 className="font-semibold mb-2">How to read this chart:</h4>
            <ul className="list-disc pl-5">
              <li>The red line represents Systolic pressure (pressure when the heart beats).</li>
              <li>The blue line represents Diastolic pressure (pressure when the heart rests between beats).</li>
              <li>The colored bars show the range between systolic (top) and diastolic (bottom) pressures.</li>
              <li>Green bars indicate a decrease or no change in systolic pressure since the last measurement.</li>
              <li>Red bars indicate an increase in systolic pressure since the last measurement.</li>
              <li>Hover over data points to see exact values and dates.</li>
            </ul>
          </div>
        );
      }
      return null;
    };
  
    if (error) {
      return (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }
  
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vitals Chart</CardTitle>
          <CardDescription>Select a vital sign to view its trend</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select onValueChange={setSelectedVital} defaultValue={selectedVital}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select vital" />
              </SelectTrigger>
              <SelectContent>
                {uniqueVitalTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="h-[400px]">
            {selectedVital === 'Blood pressure' ? (
              <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={colors[selectedVital] || '#8884d8'} 
                    name={selectedVital}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
          {renderChartExplanation()}
        </CardContent>
      </Card>
    );
  };
  
  export default VitalsChart;

