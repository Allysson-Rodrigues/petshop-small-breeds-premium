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

// Premium easing curves
const EASE_OUT_EXPO = "cubic-bezier(0.16, 1, 0.3, 1)";

export default function Sidebar({ activeTab, setActiveTab, isOpen, onClose }: SidebarProps) {
  const { isAdmin } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  const isExpanded = isHovered || !!isOpen;

  const menuItems = [
    { id: "overview", icon: "dashboard", label: "Visão Geral", adminOnly: true },
    { id: "clients", icon: "group", label: "Clientes", adminOnly: true },
    { id: "pets", icon: "pets", label: "Pets", adminOnly: false },
    { id: "appointments", icon: "calendar_month", label: "Agendamentos", adminOnly: false },
    { id: "inventory", icon: "inventory_2", label: "Estoque", adminOnly: true },
  ].filter(item => !item.adminOnly || isAdmin);

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={[
        // Mobile: fixed + translateX slide. Desktop: static part of flow.
        "fixed lg:static inset-y-0 left-0 z-30",
        "bg-[#1f1f1f] flex-shrink-0 flex flex-col h-[100dvh] text-white overflow-hidden",
        // Mobile open/close via translateX (GPU only)
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        // Desktop: collapse to icon-only, expand on hover via width
        "lg:w-20 lg:hover:w-64",
        // Width for mobile (fixed at 256px when open)
        "w-64",
        "shadow-2xl lg:shadow-none",
      ].join(" ")}
      style={{
        // Only animate transform for mobile slide (GPU-accelerated)
        // Width for desktop hover-expand (can't avoid it but will-change helps)
        transition: [
          `transform 500ms ${EASE_OUT_EXPO}`,
          `width 500ms ${EASE_OUT_EXPO}`,
        ].join(", "),
        willChange: "transform, width",
      }}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-white/10 overflow-hidden whitespace-nowrap shrink-0">
        <Link
          to="/"
          className="flex items-center gap-3 text-xl font-bold tracking-tighter hover:opacity-80 text-white transition-opacity duration-200"
        >
          <span className="material-symbols-outlined text-white text-2xl shrink-0">pets</span>
          <span
            style={{
              transition: `opacity 300ms ${EASE_OUT_EXPO} ${isExpanded ? "100ms" : "0ms"}, transform 300ms ${EASE_OUT_EXPO} ${isExpanded ? "100ms" : "0ms"}`,
              opacity: isExpanded ? 1 : 0,
              transform: isExpanded ? "translateX(0)" : "translateX(-10px)",
              pointerEvents: isExpanded ? "auto" : "none",
            }}
          >
            PETSHOP <span className="font-light text-zinc-400">SMALL</span>
          </span>
        </Link>

        {isOpen && (
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white transition-colors shrink-0"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-5 px-2.5 flex flex-col gap-0.5 overflow-x-hidden">
        {menuItems.map((item, index) => {
          const isActive = activeTab === item.id;
          const labelDelay = isExpanded ? `${80 + index * 30}ms` : "0ms";
          return (
            <a
              key={item.id}
              role="button"
              tabIndex={0}
              title={!isExpanded ? item.label : ""}
              className={[
                "flex items-center gap-4 px-3 py-3 rounded-lg cursor-pointer whitespace-nowrap",
                "transition-colors duration-200",
                isActive ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5",
              ].join(" ")}
              onClick={(e) => { e.preventDefault(); setActiveTab(item.id); if (onClose) onClose(); }}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActiveTab(item.id); if (onClose) onClose(); } }}
            >
              <span className="material-symbols-outlined text-[22px] shrink-0">{item.icon}</span>
              <span
                style={{
                  transition: `opacity 350ms ${EASE_OUT_EXPO} ${labelDelay}, transform 350ms ${EASE_OUT_EXPO} ${labelDelay}`,
                  opacity: isExpanded ? 1 : 0,
                  transform: isExpanded ? "translateX(0)" : "translateX(-8px)",
                }}
                className="text-sm font-medium"
              >
                {item.label}
              </span>
            </a>
          );
        })}

        {/* Divider section */}
        <div className="pt-3 mt-3 border-t border-white/10 flex flex-col gap-0.5">
          <Link
            to="/"
            className="flex items-center gap-4 px-3 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors duration-200 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[22px] shrink-0">home</span>
            <span
              style={{
                transition: `opacity 350ms ${EASE_OUT_EXPO} ${isExpanded ? "160ms" : "0ms"}, transform 350ms ${EASE_OUT_EXPO} ${isExpanded ? "160ms" : "0ms"}`,
                opacity: isExpanded ? 1 : 0,
                transform: isExpanded ? "translateX(0)" : "translateX(-8px)",
              }}
              className="text-sm font-medium"
            >
              Voltar ao Site
            </span>
          </Link>

          <a
            role="button"
            tabIndex={0}
            className={[
              "flex items-center gap-4 px-3 py-3 rounded-lg cursor-pointer whitespace-nowrap",
              "transition-colors duration-200",
              activeTab === "settings" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5",
            ].join(" ")}
            onClick={(e) => { e.preventDefault(); setActiveTab("settings"); if (onClose) onClose(); }}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActiveTab("settings"); if (onClose) onClose(); } }}
          >
            <span className="material-symbols-outlined text-[22px] shrink-0">settings</span>
            <span
              style={{
                transition: `opacity 350ms ${EASE_OUT_EXPO} ${isExpanded ? "190ms" : "0ms"}, transform 350ms ${EASE_OUT_EXPO} ${isExpanded ? "190ms" : "0ms"}`,
                opacity: isExpanded ? 1 : 0,
                transform: isExpanded ? "translateX(0)" : "translateX(-8px)",
              }}
              className="text-sm font-medium"
            >
              Configurações
            </span>
          </a>
        </div>
      </nav>

      <SidebarUser isCollapsed={!isExpanded} />
    </aside>
  );
}
