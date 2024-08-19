import React from 'react';

interface AllergiesProps {
  allergies?: string[]; // You can adjust the type based on your actual data structure
}

const Allergies: React.FC<AllergiesProps> = ({ allergies }) => {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Allergies</h3>
      {allergies && allergies.length > 0 ? (
        <ul>
          {allergies.map((allergy, index) => (
            <li key={index} className="text-gray-600">
              {allergy}
            </li>
          ))}
        </ul>
      ) : (
        <p>Allergy information will be displayed here.</p>
      )}
    </div>
  );
};

export default Allergies;
