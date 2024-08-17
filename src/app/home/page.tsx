// app/dashboard/page.tsx
'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell, User, Home, BarChart2, FileText, Users } from 'lucide-react';
import PatientDetails from '@/components/PatientDetails';
import TabContent from '@/components/TabContent';
import { usePatientData } from '@/hooks/usePatientData';
import { useActiveTab } from '@/hooks/useActiveTab';
import LoadingScreen from '@/components/LoadingScreen';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

export default function ProviderDashboard() {
  const { patientData, loading, showBanner } = usePatientData();
  const { activeTab, setActiveTab } = useActiveTab();


  if (loading) {
    return <LoadingScreen message="Loading patient data, please wait..." />;
  }

  if (!patientData) {
    return <div className="flex justify-center items-center h-screen">No patient data available</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - fixed */}
      {showBanner && <Sidebar />}
      {/* Main content area */}
      <div className={`flex-1 ${showBanner ? 'ml-16' : ''}`}>
        {/* Header - fixed */}
        {showBanner && <Navbar />}
    
        {/* Main content with sticky elements */}
        <main className="pt-16">
          <div className="sticky top-16 bg-gray-100 z-10">
            {showBanner && (
              <>
                <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
                  <div className="text-sm text-gray-500">Patient / {patientData?.id}</div>
                </div>
                <div className="bg-white shadow-sm">
                  <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <PatientDetails patient={patientData} />
                  </div>
                </div>
              </>
            )}

            <div className="bg-white shadow-sm">
              <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="flex h-10 items-center justify-start p-0 bg-white">
                    {['summary', 'vitals' ,'allergies', 'immunization', 'medication', 'diagnosis', 'family-history', 'documents', 'self-assessment'].map((tab) => (
                      <TabsTrigger
                        key={tab}
                        value={tab}
                        className={`px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 ${
                          activeTab === tab ? 'border-[#C99D5C] text-[#C99D5C]' : 'border-transparent'
                        }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>

          {/* Scrollable content area */}
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <TabContent activeTab={activeTab} patient={patientData} />
          </div>
        </main>
      </div>
    </div>
  );
}
