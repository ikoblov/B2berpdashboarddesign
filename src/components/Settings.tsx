import { 
  Settings as SettingsIcon, 
  Shield, 
  Users, 
  BookOpen, 
  Plug, 
  Bell, 
  MessageSquare, 
  Wallet,
  FileText,
  History,
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";

interface SettingsProps {
  onNavigate?: (view: any) => void;
}

type SettingsSection = 
  | 'general' 
  | 'roles' 
  | 'users' 
  | 'dictionaries' 
  | 'integrations' 
  | 'notifications' 
  | 'telegram' 
  | 'finance' 
  | 'templates' 
  | 'audit';

export function Settings({ onNavigate }: SettingsProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');

  const sections = [
    { id: 'general' as SettingsSection, label: 'Общие', icon: SettingsIcon },
    { id: 'roles' as SettingsSection, label: 'Роли и доступ', icon: Shield },
    { id: 'users' as SettingsSection, label: 'Пользователи', icon: Users },
    { id: 'dictionaries' as SettingsSection, label: 'Справочники', icon: BookOpen },
    { id: 'integrations' as SettingsSection, label: 'Интеграции', icon: Plug },
    { id: 'notifications' as SettingsSection, label: 'Уведомления', icon: Bell },
    { id: 'telegram' as SettingsSection, label: 'Telegram бот', icon: MessageSquare },
    { id: 'finance' as SettingsSection, label: 'Финансы', icon: Wallet },
    { id: 'templates' as SettingsSection, label: 'Шаблоны документов', icon: FileText },
    { id: 'audit' as SettingsSection, label: 'Аудит', icon: History },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Local Settings Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
        <div className="p-6">
          <h2 className="text-gray-900 mb-6">Настройки</h2>
          <nav className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                    activeSection === section.id
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        <div className="max-w-[1000px]">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <span>Настройки</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">
              {sections.find(s => s.id === activeSection)?.label}
            </span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-gray-900 mb-2">
              {sections.find(s => s.id === activeSection)?.label}
            </h1>
            <p className="text-gray-600">
              Управление настройками системы
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  {(() => {
                    const Icon = sections.find(s => s.id === activeSection)?.icon || SettingsIcon;
                    return <Icon className="w-8 h-8 text-gray-400" />;
                  })()}
                </div>
                <h3 className="text-gray-900 mb-2">
                  {sections.find(s => s.id === activeSection)?.label}
                </h3>
                <p className="text-gray-500 text-sm">
                  Настройки этого раздела будут доступны в следующих обновлениях
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}