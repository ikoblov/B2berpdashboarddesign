import { Bell, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";

interface TopNavProps {
  onNavigate?: (view: 'dashboard' | 'activity' | 'communications' | 'tasks' | 'requests') => void;
  currentView?: string;
}

export function TopNav({ onNavigate, currentView }: TopNavProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-semibold text-sm">PF</span>
            </div>
            <span className="text-gray-900 tracking-tight">ERP</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500 hover:bg-red-500 border-2 border-white">
              3
            </Badge>
          </Button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="text-right">
              <div className="text-sm text-gray-900">Анна Петрова</div>
              <div className="text-xs text-gray-500">Администратор</div>
            </div>
            <Avatar className="w-9 h-9 cursor-pointer">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                АП
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </nav>
  );
}