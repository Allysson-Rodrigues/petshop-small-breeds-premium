import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Toast from "../components/ui/Toast";
import { useAuth } from "../hooks/useAuth";
import DashboardHeader from "./dashboard/components/DashboardHeader";
import AppointmentsTab from "./dashboard/tabs/AppointmentsTab";
import ClientsTab from "./dashboard/tabs/ClientsTab";
import InventoryTab from "./dashboard/tabs/InventoryTab";
import OverviewTab from "./dashboard/tabs/OverviewTab";
import PetsTab from "./dashboard/tabs/PetsTab";
import SettingsTab from "./dashboard/tabs/SettingsTab";

export default function Dashboard() {

  const navigate = useNavigate();
  const { user, isAdmin, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState(() =>
    isAdmin ? "overview" : "pets",
  );
  const [toastMessage, setToastMessage] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    }
  }, [user, isAuthenticated, navigate]);

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
        activeTab={activeTab}
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
      <main id="main-content" className="flex-1 flex flex-col h-screen overflow-hidden relative bg-background-light">
        {/* Header especializado */}
        <DashboardHeader
          activeTab={activeTab}
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {activeTab === "overview" && isAdmin ? (
            <OverviewTab showToast={showToast} setActiveTab={setActiveTab} />
          ) : activeTab === "clients" && isAdmin ? (
            <ClientsTab showToast={showToast} searchQuery={globalSearch} />
          ) : activeTab === "pets" ? (
            <PetsTab showToast={showToast} searchQuery={globalSearch} />
          ) : activeTab === "appointments" ? (
            <AppointmentsTab showToast={showToast} />
          ) : activeTab === "inventory" && isAdmin ? (
            <InventoryTab showToast={showToast} searchQuery={globalSearch} />
          ) : activeTab === "settings" ? (
            <SettingsTab showToast={showToast} />
          ) : (
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
                onClick={() => setActiveTab("pets")}
                className="mt-6 px-6 py-2.5 bg-neutral-900 text-white rounded-xl font-bold hover:bg-neutral-800 transition-all shadow-lg shadow-black/10 active:scale-95"
              >
                Ir para Meus Pets
              </button>
            </div>
          )}
        </div>
      </main>

      <Toast message={toastMessage} />
    </div>
  );
}
