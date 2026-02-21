import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import SidebarUser from "./SidebarUser";

type SidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { isAdmin } = useAuth();

  const menuItems = [
    { id: "overview", icon: "dashboard", label: "Visão Geral", adminOnly: true },
    { id: "clients", icon: "group", label: "Clientes", adminOnly: true },
    { id: "pets", icon: "pets", label: "Pets", adminOnly: false },
    { id: "appointments", icon: "calendar_month", label: "Agendamentos", adminOnly: false },
    { id: "inventory", icon: "inventory_2", label: "Estoque", adminOnly: true },
  ].filter(item => !item.adminOnly || isAdmin);

  return (
    <aside className="w-64 bg-[#1f1f1f] flex-shrink-0 flex flex-col h-screen text-white transition-all duration-300 z-20">
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="text-xl font-bold tracking-tighter hover:opacity-80 transition-opacity text-white"
          >
            PETSHOP{" "}
            <span className="font-light text-zinc-400 underline decoration-white underline-offset-4">
              SMALL BREEDS
            </span>
          </Link>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1">
        {menuItems.map((item) => (
          <a
            key={item.id}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg group transition-colors cursor-pointer ${activeTab === item.id
                ? "bg-white/10 text-white"
                : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab(item.id);
            }}
          >
            <span className="material-symbols-outlined text-[20px]">
              {item.icon}
            </span>
            <span className="text-sm font-medium">{item.label}</span>
          </a>
        ))}

        <div className="pt-4 mt-4 border-t border-white/10">
          <a
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg group transition-colors cursor-pointer ${activeTab === "settings"
                ? "bg-white/10 text-white"
                : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("settings");
            }}
          >
            <span className="material-symbols-outlined text-[20px]">
              settings
            </span>
            <span className="text-sm font-medium">Configurações</span>
          </a>
        </div>
      </nav>

      <SidebarUser />
    </aside>
  );
}
