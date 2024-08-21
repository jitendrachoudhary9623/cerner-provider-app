// components/Sidebar.tsx
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell, User, Home, BarChart2, FileText, Users } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-16 bg-[#212121] flex flex-col items-center py-4 space-y-8 z-30">
          <div className="w-10 h-10 bg-[#303030] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">J</span>
          </div>
          <nav className="flex flex-col items-center space-y-6">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Home className="h-6 w-6" />
            </Button>



            
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <BarChart2 className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <FileText className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="text-[#C99D5C]">
              <Users className="h-6 w-6" />
            </Button>
          </nav>
        </aside>
  );
};

export default Sidebar;