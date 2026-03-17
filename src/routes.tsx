import { createBrowserRouter, Outlet } from "react-router";
import { useNavigate, useParams } from "react-router";
import { SidebarProvider } from "./contexts/SidebarContext";
import { TopNav } from "./components/TopNav";
import { MainLayout } from "./components/MainLayout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { viewToPath } from "./lib/navigation";

// Import all screens
import { Dashboard } from "./components/Dashboard";
import { ActivityFeed } from "./components/ActivityFeed";
import { Communications } from "./components/Communications";
import { Clients } from "./components/Clients";
import { ClientProfile } from "./components/ClientProfile";
import { Objects } from "./components/Objects";
import { ObjectDetail } from "./components/ObjectDetail";
import { Requests } from "./components/Requests";
import { RequestDetail } from "./components/RequestDetail";
import { Shifts } from "./components/Shifts";
import { ShiftDetail } from "./components/ShiftDetail";
import { Workers } from "./components/Workers";
import { WorkerProfile } from "./components/WorkerProfile";
import { ExecutorCard } from "./components/ExecutorCard";
import { Payments } from "./components/Payments";
import { Reports } from "./components/Reports";
import { Tasks } from "./components/Tasks";
import { Settings } from "./components/Settings";
import { AutoPlanningScreen } from "./components/AutoPlanningScreen";

// Root layout with persistent sidebar
function RootLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50">
        <TopNav />
        <MainLayout>
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </MainLayout>
      </div>
    </SidebarProvider>
  );
}

// Helper hook: creates an onNavigate adapter for legacy components
function useAppNavigate() {
  const navigate = useNavigate();
  return (view: string, id?: string) => {
    navigate(viewToPath(view, id));
  };
}

// Page wrappers that connect existing components to React Router
function DashboardPage() {
  const onNavigate = useAppNavigate();
  return <Dashboard onNavigate={onNavigate} />;
}

function ActivityPage() {
  return <ActivityFeed />;
}

function CommunicationsPage() {
  return <Communications />;
}

function ClientsPage() {
  const navigate = useNavigate();
  return <Clients onOpenClientProfile={(id) => navigate(`/clients/${id}`)} />;
}

function ClientProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  return <ClientProfile clientId={id || ""} onBack={() => navigate("/clients")} />;
}

function ObjectsPage() {
  const navigate = useNavigate();
  return <Objects onOpenObjectDetail={(id) => navigate(`/objects/${id}`)} />;
}

function ObjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  return <ObjectDetail objectId={id || ""} onBack={() => navigate("/objects")} />;
}

function RequestsPage() {
  const navigate = useNavigate();
  return <Requests onOpenRequestDetail={(id) => navigate(`/requests/${id}`)} />;
}

function RequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  return <RequestDetail requestId={id || ""} onBack={() => navigate("/requests")} />;
}

function ShiftsPage() {
  const navigate = useNavigate();
  return <Shifts onOpenShiftDetail={(id) => navigate(`/shifts/${id}`)} />;
}

function ShiftDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  return <ShiftDetail shiftId={id || ""} onBack={() => navigate("/shifts")} />;
}

function WorkersPage() {
  const navigate = useNavigate();
  return <Workers onOpenWorkerProfile={(id) => navigate(`/workers/${id}`)} />;
}

function WorkerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  return <WorkerProfile workerId={id || ""} onBack={() => navigate("/workers")} />;
}

function ExecutorCardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  return <ExecutorCard executorId={id || ""} onBack={() => navigate("/workers")} />;
}

function PaymentsPage() {
  const onNavigate = useAppNavigate();
  return <Payments onNavigate={onNavigate} />;
}

function ReportsPage() {
  return <Reports />;
}

function TasksPage() {
  return <Tasks />;
}

function SettingsPage() {
  return <Settings />;
}

function AutoPlanningPage() {
  return <AutoPlanningScreen />;
}

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h2 className="text-gray-900 mb-2">Страница не найдена</h2>
        <p className="text-sm text-gray-500 mb-4">Запрашиваемая страница не существует</p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          На главную
        </button>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "activity", Component: ActivityPage },
      { path: "communications", Component: CommunicationsPage },
      { path: "clients", Component: ClientsPage },
      { path: "clients/:id", Component: ClientProfilePage },
      { path: "objects", Component: ObjectsPage },
      { path: "objects/:id", Component: ObjectDetailPage },
      { path: "requests", Component: RequestsPage },
      { path: "requests/:id", Component: RequestDetailPage },
      { path: "shifts", Component: ShiftsPage },
      { path: "shifts/:id", Component: ShiftDetailPage },
      { path: "workers", Component: WorkersPage },
      { path: "workers/:id", Component: WorkerProfilePage },
      { path: "workers/:id/card", Component: ExecutorCardPage },
      { path: "payments", Component: PaymentsPage },
      { path: "reports", Component: ReportsPage },
      { path: "tasks", Component: TasksPage },
      { path: "settings", Component: SettingsPage },
      { path: "auto-planning", Component: AutoPlanningPage },
      { path: "*", Component: NotFound },
    ],
  },
]);
