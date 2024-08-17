// components/Navbar.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell, User, Home, BarChart2, FileText, Users } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="fixed top-0 right-0 left-16 bg-white shadow-sm z-20">
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      <div className="flex items-center">
        <ArrowLeft className="h-6 w-6 text-gray-500 mr-2" />
        <h1 className="text-lg font-semibold text-gray-700">Patient card</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Bell className="h-6 w-6 text-gray-500" />
        <div className="relative">
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          <User className="h-6 w-6 text-gray-500" />
        </div>
      </div>
    </div>
  </header>
  );
};

export default Navbar;