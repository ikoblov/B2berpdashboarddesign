import { useState } from "react";
import { PaymentsV15 } from "./payments/PaymentsV15Compact";
import RegistersV2 from "./payments/RegistersV2";
import TrustedSMZ from "./payments/TrustedSMZ";
import RiskMonitor from "./payments/RiskMonitor";
import { cn } from "../lib/utils";

interface PaymentsProps {
  onNavigate?: (view: string) => void;
}

type PaymentsTab = 'pending' | 'registers' | 'distributors' | 'risks';

export function Payments({ onNavigate }: PaymentsProps) {
  const [activeTab, setActiveTab] = useState<PaymentsTab>('distributors');

  return (
    <div className="p-6">
      <div className="max-w-[1800px] mx-auto">
        {/* Compact Tab Navigation */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-4 p-1.5">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('pending')}
              className={cn(
                "flex-1 px-4 py-2 rounded text-xs transition-all",
                activeTab === 'pending'
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              Подготовка реестра
            </button>
            <button
              onClick={() => setActiveTab('registers')}
              className={cn(
                "flex-1 px-4 py-2 rounded text-xs transition-all",
                activeTab === 'registers'
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              Реестры
            </button>
            <button
              onClick={() => setActiveTab('distributors')}
              className={cn(
                "flex-1 px-4 py-2 rounded text-xs transition-all",
                activeTab === 'distributors'
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              Доверенные СМЗ
            </button>
            <button
              onClick={() => setActiveTab('risks')}
              className={cn(
                "flex-1 px-4 py-2 rounded text-xs transition-all",
                activeTab === 'risks'
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              Проверка рисков
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in duration-200">
          {activeTab === 'pending' && <PaymentsV15 />}
          {activeTab === 'registers' && <RegistersV2 />}
          {activeTab === 'distributors' && <TrustedSMZ />}
          {activeTab === 'risks' && <RiskMonitor />}
        </div>
      </div>
    </div>
  );
}