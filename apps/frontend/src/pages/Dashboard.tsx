import { Suspense, lazy, useEffect, useState } from "react";
import RoleGuard from "../components/auth/RoleGuard";
import Sidebar from "../components/layout/Sidebar";
import Toast from "../components/ui/Toast";
import { useAuth } from "../hooks/useAuth";
import DashboardHeader from "./dashboard/components/DashboardHeader";
import { TabLoadingState } from "./dashboard/components/TabState";

const AppointmentsTab = lazy(() => import("./dashboard/tabs/AppointmentsTab"));
const ClientsTab = lazy(() => import("./dashboard/tabs/ClientsTab"));
const InventoryTab = lazy(() => import("./dashboard/tabs/InventoryTab"));
const OverviewTab = lazy(() => import("./dashboard/tabs/OverviewTab"));
const PetsTab = lazy(() => import("./dashboard/tabs/PetsTab"));
const SettingsTab = lazy(() => import("./dashboard/tabs/SettingsTab"));

export default function Dashboard() {

  const { user, isAdmin } = useAuth();
  const restrictedTabs = ["overview", "clients", "inventory"] as const;

  const [activeTab, setActiveTab] = useState(() =>
    isAdmin ? "overview" : "pets",
  );
  const [toastMessage, setToastMessage] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const currentTab =
    !isAdmin && restrictedTabs.includes(activeTab as (typeof restrictedTabs)[number])
      ? "pets"
      : activeTab;

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    if (!isSidebarOpen) {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
      return;
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isSidebarOpen]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  if (!user) return null;

  return (
    <div
      className="bg-background-light text-primary font-display antialiased min-h-screen flex overflow-hidden"
    >
      <a href="#main-content" className="sr-only focus:not-sr-only">
        Pular para o conteúdo principal do painel
      </a>
      {/* Sidebar Component */}
      <Sidebar
        activeTab={currentTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Overlay para mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main id="main-content" className="flex-1 flex flex-col min-h-screen overflow-hidden relative bg-background-light">
        {/* Header especializado */}
        <DashboardHeader
          activeTab={currentTab}
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Suspense fallback={<DashboardTabFallback activeTab={currentTab} />}>
            {currentTab === "overview" ? (
              <RoleGuard
                allowedRoles={["admin"]}
                fallback={<RestrictedState activeTab={currentTab} onReset={() => setActiveTab("pets")} />}
              >
                <OverviewTab showToast={showToast} setActiveTab={setActiveTab} />
              </RoleGuard>
            ) : currentTab === "clients" ? (
              <RoleGuard
                allowedRoles={["admin"]}
                fallback={<RestrictedState activeTab={currentTab} onReset={() => setActiveTab("pets")} />}
              >
                <ClientsTab showToast={showToast} searchQuery={globalSearch} />
              </RoleGuard>
            ) : currentTab === "pets" ? (
              <PetsTab showToast={showToast} searchQuery={globalSearch} />
            ) : currentTab === "appointments" ? (
              <AppointmentsTab showToast={showToast} />
            ) : currentTab === "inventory" ? (
              <RoleGuard
                allowedRoles={["admin"]}
                fallback={<RestrictedState activeTab={currentTab} onReset={() => setActiveTab("pets")} />}
              >
                <InventoryTab showToast={showToast} searchQuery={globalSearch} />
              </RoleGuard>
            ) : (
              <SettingsTab showToast={showToast} />
            )}
          </Suspense>
        </div>
      </main>

      <Toast message={toastMessage} />
    </div>
  );
}

function DashboardTabFallback({ activeTab }: { activeTab: string }) {
  return (
    <div
      className="rounded-2xl border border-[#e5e5e5] bg-white shadow-sm"
      aria-live="polite"
    >
      <TabLoadingState label={`Carregando ${activeTab}...`} />
    </div>
  );
}

function RestrictedState({
  activeTab,
  onReset,
}: {
  activeTab: string;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center mt-20">
      <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
        lock_person
      </span>
      <h2 className="text-xl font-bold text-primary mb-2">
        Acesso Restrito
      </h2>
      <p className="text-gray-500 max-w-md">
        Esta área ({activeTab}) é exclusiva para administradores.
        Por favor, utilize as abas permitidas.
      </p>
      <button
        onClick={onReset}
        className="mt-6 px-6 py-2.5 bg-neutral-900 text-white rounded-xl font-bold hover:bg-neutral-800 transition-all shadow-lg shadow-black/10 active:scale-95"
      >
        Ir para Meus Pets
      </button>
    </div>
  );
}
