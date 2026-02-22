import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import SidebarUser from "./SidebarUser";

type SidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
};

export default function Sidebar({ activeTab, setActiveTab, isOpen, onClose }: SidebarProps) {
  const { isAdmin } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  // No mobile, ignoramos o estado de hover para a largura
  const isExpanded = isHovered || !!isOpen;

  const menuItems = [
    { id: "overview", icon: "dashboard", label: "Visão Geral", adminOnly: true },
    { id: "clients", icon: "group", label: "Clientes", adminOnly: true },
    { id: "pets", icon: "pets", label: "Pets", adminOnly: false },
    { id: "appointments", icon: "calendar_month", label: "Agendamentos", adminOnly: false },
    { id: "inventory", icon: "inventory_2", label: "Estoque", adminOnly: true },
  ].filter(item => !item.adminOnly || isAdmin);

  return (
    <>
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed lg:static inset-y-0 left-0 bg-[#1f1f1f] flex-shrink-0 flex flex-col h-screen text-white transition-all duration-500 ease-in-out z-30 transform
          ${isOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"}
          ${!isOpen ? "lg:w-20 lg:hover:w-64" : "w-64"}
          shadow-2xl lg:shadow-none`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 overflow-hidden whitespace-nowrap">
          <Link
            to="/"
            className="flex items-center gap-3 text-xl font-bold tracking-tighter hover:opacity-80 transition-opacity text-white"
          >
            <span className="material-symbols-outlined text-white text-2xl shrink-0">
              pets
            </span>
            <span className={`transition-opacity duration-500 ease-in-out ${!isExpanded ? "lg:opacity-0" : "opacity-100"}`}>
              PETSHOP <span className="font-light text-zinc-400">SMALL</span>
            </span>
          </Link>

          {isOpen && (
            <button
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1 overflow-x-hidden">
          {menuItems.map((item) => (
            <a
              key={item.id}
              role="button"
              tabIndex={0}
              title={!isExpanded ? item.label : ""}
              className={`flex items-center gap-4 px-3 py-3 rounded-lg group transition-colors cursor-pointer whitespace-nowrap ${activeTab === item.id
                ? "bg-white/10 text-white"
                : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(item.id);
                if (onClose) onClose();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveTab(item.id);
                  if (onClose) onClose();
                }
              }}
            >
              <span className="material-symbols-outlined text-[24px] shrink-0">
                {item.icon}
              </span>
              <span className={`text-sm font-medium transition-opacity duration-500 ease-in-out ${!isExpanded ? "lg:opacity-0" : "opacity-100"}`}>
                {item.label}
              </span>
            </a>
          ))}

          <div className="pt-4 mt-4 border-t border-white/10 flex flex-col gap-1">
            <Link
              to="/"
              className="flex items-center gap-4 px-3 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[24px] shrink-0">
                home
              </span>
              <span className={`text-sm font-medium transition-opacity duration-500 ease-in-out ${!isExpanded ? "lg:opacity-0" : "opacity-100"}`}>
                Voltar ao Site
              </span>
            </Link>

            <a
              role="button"
              tabIndex={0}
              className={`flex items-center gap-4 px-3 py-3 rounded-lg group transition-colors cursor-pointer whitespace-nowrap ${activeTab === "settings"
                ? "bg-white/10 text-white"
                : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("settings");
                if (onClose) onClose();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveTab("settings");
                  if (onClose) onClose();
                }
              }}
            >
              <span className="material-symbols-outlined text-[24px] shrink-0">
                settings
              </span>
              <span className={`text-sm font-medium transition-opacity duration-500 ease-in-out ${!isExpanded ? "lg:opacity-0" : "opacity-100"}`}>
                Configurações
              </span>
            </a>
          </div>
        </nav>

        <SidebarUser isCollapsed={!isExpanded} />
      </aside>
    </>
  );
}
