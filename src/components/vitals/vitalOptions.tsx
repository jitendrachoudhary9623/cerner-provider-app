export const vitalOptions = [
  {
    code: 'blood-pressure',
    name: 'Blood Pressure',
    unit: 'mmHg',
    normalRange: { systolic: { min: 90, max: 120 }, diastolic: { min: 60, max: 80 } },
    insights: [
      'Indicates the force of blood against artery walls',
      'Important for cardiovascular health',
      'Elevated levels may indicate hypertension',
      'Low levels may indicate hypotension'
    ],
    fhirCode: '85354-9',
    inputType: 'dual'
  },
  {
    code: 'heart-rate',
    name: 'Heart Rate',
    unit: 'bpm',
    normalRange: { min: 60, max: 100 },
    insights: [
      'Measures how many times your heart beats per minute',
      'Can indicate fitness level and stress',
      'Elevated rates may suggest anxiety or cardiac issues',
      'Low rates might indicate excellent fitness or heart problems'
    ],
    fhirCode: '8867-4',
    inputType: 'single'

  },
  {
    code: 'temperature',
    name: 'Body Temperature',
    unit: '°C',
    normalRange: { min: 36.1, max: 37.2 },
    insights: [
      'Core body temperature',
      'Can indicate infection or illness',
      'Fever is often defined as 38°C (100.4°F) or higher',
      'Hypothermia is typically defined as body temperature below 35°C (95°F)'
    ],
    fhirCode: '8310-5',
    inputType: 'single'

  },
  {
    code: 'respiratory-rate',
    name: 'Respiratory Rate',
    unit: 'breaths/min',
    normalRange: { min: 12, max: 20 },
    insights: [
      'Number of breaths taken per minute',
      'Can indicate respiratory or cardiac issues',
      'Elevated rates may suggest anxiety, fever, or respiratory distress',
      'Low rates might indicate narcotic use or neurological problems'
    ],
    fhirCode: '9279-1',
    inputType: 'single'
  },
  {
    code: 'oxygen-saturation',
    name: 'Oxygen Saturation',
    unit: '%',
    normalRange: { min: 95, max: 100 },
    insights: [
      'Percentage of oxygen in the blood',
      'Important for overall health and organ function',
      'Levels below 90% may indicate hypoxemia',
      'Consistently low levels may suggest chronic respiratory issues'
    ],
    fhirCode: '2708-6',
    inputType: 'single'
  },
  {
    code: 'body-weight',
    name: 'Body weight',
    unit: 'lbs',
    normalRange: { min: 50, max: 100 },
    insights: [
      'Measures the weight of the patient',
      'Important for overall health and fitness',
      'Elevated levels may indicate obesity',
      'Low levels may indicate malnutrition'
    ],
    inputType: 'single'
  },
  {
    code: 'bmi',
    name: 'Body Mass Index (BMI)',
    unit: 'kg/m2',
    normalRange: { min: 18.5, max: 24.9 },
    insights: [
      'Measures the body fat based on weight and height',
      'Important for overall health and fitness',
      'Elevated levels may indicate obesity',
      'Low levels may indicate malnutrition'
    ],
    fhirCode: '39156-5',
    inputType: 'single'
  }
];
