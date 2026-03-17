import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  FileText, 
  Clock, 
  UserCircle, 
  DollarSign, 
  BarChart3, 
  Settings,
  Activity,
  MessageCircle,
  ChevronDown,
  ChevronRight,
  CheckSquare,
  ChevronLeft,
  Menu,
  Sparkles
} from "lucide-react";
import { cn } from "../lib/utils";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useSidebar } from "../contexts/SidebarContext";

// NavButton — defined OUTSIDE Sidebar to prevent re-creation on every render
function NavButton({ 
  icon, 
  label, 
  onClick, 
  active, 
  badge,
  isCollapsed,
  className 
}: { 
  icon: React.ReactNode; 
  label: string; 
  onClick: () => void; 
  active?: boolean; 
  badge?: number | string;
  isCollapsed?: boolean;
  className?: string;
}) {
  const button = (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
        active 
          ? "bg-blue-50 text-blue-700" 
          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
        isCollapsed && "justify-center px-2",
        className
      )}
    >
      <span className={cn("text-gray-500 flex-shrink-0", active && "text-blue-600")}>
        {icon}
      </span>
      {!isCollapsed && (
        <>
          <span className="flex-1 text-left">{label}</span>
          {badge && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full flex-shrink-0">
              {badge}
            </span>
          )}
        </>
      )}
      {isCollapsed && badge && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[9px] rounded-full flex items-center justify-center">
          {badge}
        </span>
      )}
    </button>
  );

  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative">
              {button}
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={10}>
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
}

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    clients: false,
    requests: false,
  });
  const { isCollapsed, setIsCollapsed } = useSidebar();

  const toggleSection = (section: string) => {
    if (isCollapsed) return;
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath === path || currentPath.startsWith(path + '/');
  };

  const go = (path: string) => {
    navigate(path);
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-16 bottom-0 bg-white border-r border-gray-200 overflow-y-auto transition-all duration-300 ease-in-out z-40",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4">
        {/* Collapse/Expand Button */}
        <div className={cn(
          "mb-4 pb-4 border-b border-gray-200",
          isCollapsed && "flex justify-center"
        )}>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
            title={isCollapsed ? "Развернуть меню" : "Свернуть меню"}
          >
            {isCollapsed ? (
              <Menu className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-xs">Свернуть</span>
              </>
            )}
          </button>
        </div>

        <nav className="space-y-1">
          {/* Dashboard */}
          <NavButton
            icon={<LayoutDashboard className="w-5 h-5" />}
            label="Дашборд"
            onClick={() => go('/')}
            active={isActive('/')}
            isCollapsed={isCollapsed}
          />

          {/* Activity Feed */}
          <NavButton
            icon={<Activity className="w-5 h-5" />}
            label="Лента"
            onClick={() => go('/activity')}
            active={isActive('/activity')}
            isCollapsed={isCollapsed}
          />

          {/* Communications */}
          <NavButton
            icon={<MessageCircle className="w-5 h-5" />}
            label="Коммуникации"
            onClick={() => go('/communications')}
            active={isActive('/communications')}
            badge={3}
            isCollapsed={isCollapsed}
          />

          {/* Clients - Expandable */}
          {!isCollapsed ? (
            <div>
              <button
                onClick={() => {
                  toggleSection('clients');
                  if (!expandedSections.clients) {
                    go('/clients');
                  }
                }}
                className={cn(
                  "w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                  isActive('/clients')
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-500">
                    <Users className="w-5 h-5" />
                  </span>
                  <span>Клиенты</span>
                </div>
                {expandedSections.clients ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>
              
              {expandedSections.clients && (
                <div className="ml-8 mt-1 space-y-1">
                  <button className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition-all text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span>Заказ-наряды</span>
                    </div>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                      5
                    </span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavButton
              icon={<Users className="w-5 h-5" />}
              label="Клиенты"
              onClick={() => go('/clients')}
              active={isActive('/clients')}
              isCollapsed={isCollapsed}
            />
          )}

          {/* Objects */}
          <NavButton
            icon={<Building2 className="w-5 h-5" />}
            label="Объекты"
            onClick={() => go('/objects')}
            active={isActive('/objects')}
            isCollapsed={isCollapsed}
          />

          {/* Requests */}
          {!isCollapsed ? (
            <>
              <button
                onClick={() => {
                  toggleSection('requests');
                  if (!expandedSections.requests) {
                    go('/requests');
                  }
                }}
                className={cn(
                  "w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                  isActive('/requests')
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-500">
                    <FileText className="w-5 h-5" />
                  </span>
                  <span>Заявки</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                    9
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-gray-400 transition-transform",
                      expandedSections.requests && "rotate-180"
                    )}
                  />
                </div>
              </button>

              {expandedSections.requests && (
                <div className="ml-9 space-y-1 mt-1">
                  <button
                    onClick={() => go('/requests')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
                  >
                    Все заявки
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all">
                    Шаблоны заявок
                  </button>
                </div>
              )}
            </>
          ) : (
            <NavButton
              icon={<FileText className="w-5 h-5" />}
              label="Заявки"
              onClick={() => go('/requests')}
              active={isActive('/requests')}
              badge={9}
              isCollapsed={isCollapsed}
            />
          )}

          {/* Shifts */}
          <NavButton
            icon={<Clock className="w-5 h-5" />}
            label="Смены"
            onClick={() => go('/shifts')}
            active={isActive('/shifts')}
            isCollapsed={isCollapsed}
          />

          {/* Workers */}
          <NavButton
            icon={<UserCircle className="w-5 h-5" />}
            label="Исполнители"
            onClick={() => go('/workers')}
            active={isActive('/workers')}
            isCollapsed={isCollapsed}
          />

          {/* Payroll */}
          <NavButton
            icon={<DollarSign className="w-5 h-5" />}
            label="Выплаты"
            onClick={() => go('/payments')}
            active={isActive('/payments')}
            isCollapsed={isCollapsed}
          />

          {/* Reports */}
          <NavButton
            icon={<BarChart3 className="w-5 h-5" />}
            label="Отчёты"
            onClick={() => go('/reports')}
            active={isActive('/reports')}
            isCollapsed={isCollapsed}
          />

          {/* Tasks */}
          <NavButton
            icon={<CheckSquare className="w-5 h-5" />}
            label="Задачи"
            onClick={() => go('/tasks')}
            active={isActive('/tasks')}
            badge={7}
            isCollapsed={isCollapsed}
          />

          {/* Auto Planning */}
          <NavButton
            icon={<Sparkles className="w-5 h-5" />}
            label="Автопланирование"
            onClick={() => go('/auto-planning')}
            active={isActive('/auto-planning')}
            isCollapsed={isCollapsed}
          />

          {/* Settings */}
          <NavButton
            icon={<Settings className="w-5 h-5" />}
            label="Настройки"
            onClick={() => go('/settings')}
            active={isActive('/settings')}
            isCollapsed={isCollapsed}
          />
        </nav>

        {/* Bottom Section */}
        {!isCollapsed && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="px-3 py-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-100">
              <div className="text-sm text-gray-900 mb-1">Нужна помощь?</div>
              <p className="text-xs text-gray-600 mb-3">Проверьте нашу документацию</p>
              <button className="w-full px-3 py-1.5 bg-white text-blue-600 text-xs rounded-md shadow-sm hover:shadow transition-shadow border border-blue-200">
                Открыть документацию
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
