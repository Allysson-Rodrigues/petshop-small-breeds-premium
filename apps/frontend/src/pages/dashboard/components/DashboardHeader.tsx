import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../../../hooks/useAuth";
import NotionAvatar from "./NotionAvatar";

type DashboardHeaderProps = {
    activeTab: string;
    globalSearch: string;
    setGlobalSearch: (search: string) => void;
    showSearch?: boolean;
    onMenuClick?: () => void;
};

type Notification = {
    id: number;
    icon: string;
    iconColor: string;
    title: string;
    description: string;
    time: string;
    unread: boolean;
    adminOnly?: boolean;
};

const ADMIN_MOCK_NOTIFICATIONS: Notification[] = [
    // Admin-only: stock alerts
    {
        id: 1,
        icon: "warning",
        iconColor: "text-amber-500",
        title: "Estoque Crítico",
        description: "Antipulgas Gatos (2 unid.) abaixo do mínimo.",
        time: "agora",
        unread: true,
        adminOnly: true,
    },
    {
        id: 3,
        icon: "inventory_2",
        iconColor: "text-orange-400",
        title: "Estoque Baixo",
        description: "Ração Premium 15kg com apenas 4 unidades.",
        time: "há 30 min",
        unread: false,
        adminOnly: true,
    },
    // Admin-only: all client appointments overview
    {
        id: 5,
        icon: "calendar_month",
        iconColor: "text-blue-500",
        title: "3 agendamentos hoje",
        description: "Rex (17h), Mel (18h) e Thor (19h30).",
        time: "há 2h",
        unread: true,
        adminOnly: true,
    },
];

export default function DashboardHeader({
    activeTab,
    globalSearch,
    setGlobalSearch,
    showSearch = true,
    onMenuClick,
}: DashboardHeaderProps) {
    const { user, isAdmin } = useAuth();
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState(ADMIN_MOCK_NOTIFICATIONS);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const visibleNotifications = isAdmin
        ? notifications
        : [];
    const unreadCount = visibleNotifications.filter(n => n.unread).length;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsNotifOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    };

    const getTabTitle = (tab: string) => {
        switch (tab) {
            case "overview": return "Visão Geral";
            case "clients": return "Clientes";
            case "pets": return "Meus Pets";
            case "appointments": return "Agendamentos";
            case "inventory": return "Controle de Estoque";
            case "settings": return "Configurações";
            default: return "Dashboard";
        }
    };

    return (
        <header
            className="h-16 border-b border-gray-100 flex items-center justify-between px-4 md:px-8 bg-white/80 backdrop-blur-md sticky top-0 z-10 w-full overflow-visible"
            lang="pt-BR"
        >
            <Helmet>
                <title>Dashboard | Small Breeds</title>
                <meta
                    name="description"
                    content="Painel de gestão de pets, agendamentos e estoque do Small Breeds."
                />
                <meta property="og:title" content="Dashboard | Small Breeds" />
                <meta
                    property="og:description"
                    content="Painel de gestão de pets, agendamentos e estoque do Small Breeds."
                />
                <link rel="canonical" href="https://smallbreeds.com.br/dashboard" />
            </Helmet>
            <div className="flex items-center gap-3 overflow-hidden">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-black transition-colors shrink-0"
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>

                <h2 className="text-base md:text-xl font-semibold text-gray-800 tracking-tight truncate shrink-0">
                    {getTabTitle(activeTab)}
                </h2>

                {showSearch && (activeTab === "clients" || activeTab === "pets" || activeTab === "inventory") && (
                    <div className="relative group ml-4 hidden md:block">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg group-focus-within:text-black transition-colors">
                            search
                        </span>
                        <input
                            type="text"
                            aria-label={`Buscar em ${getTabTitle(activeTab).toLowerCase()}`}
                            placeholder={`Buscando em ${getTabTitle(activeTab).toLowerCase()}...`}
                            className="pl-10 pr-4 py-1.5 bg-gray-50 border-none rounded-full text-sm focus:ring-1 focus:ring-black w-64 transition-all outline-none"
                            value={globalSearch}
                            onChange={(e) => setGlobalSearch(e.target.value)}
                        />
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2 md:gap-6 shrink-0">

                {/* Notification Bell */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsNotifOpen(prev => !prev)}
                        className="relative p-2 text-gray-400 hover:text-black transition-colors rounded-lg hover:bg-gray-50"
                        aria-label="Notificações"
                    >
                        <span className="material-symbols-outlined text-[22px]">notifications</span>
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 bg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Dropdown */}
                    <div
                        style={{
                            transition: "opacity 200ms cubic-bezier(0.16,1,0.3,1), transform 200ms cubic-bezier(0.16,1,0.3,1)",
                            opacity: isNotifOpen ? 1 : 0,
                            transform: isNotifOpen ? "translateY(0) scale(1)" : "translateY(-8px) scale(0.97)",
                            pointerEvents: isNotifOpen ? "auto" : "none",
                            transformOrigin: "top right",
                        }}
                        className="fixed inset-x-4 top-[72px] sm:inset-auto sm:absolute sm:right-0 sm:top-[calc(100%+8px)] sm:w-80 bg-white rounded-xl border border-gray-100 shadow-xl z-50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                            <span className="text-sm font-semibold text-gray-900">Notificações</span>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="text-xs text-gray-400 hover:text-black transition-colors font-medium"
                                >
                                    Marcar todas como lidas
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                            {visibleNotifications.length === 0 ? (
                                <div className="px-4 py-6 text-center text-sm text-gray-500">
                                    Nenhuma notificação no momento.
                                </div>
                            ) : (
                                visibleNotifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className={`flex gap-3 px-4 py-3 cursor-pointer transition-colors ${notif.unread ? "bg-gray-50/80 hover:bg-gray-100/60" : "hover:bg-gray-50"}`}
                                        onClick={() => setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, unread: false } : n))}
                                    >
                                        <div className="shrink-0 w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                                            <span className={`material-symbols-outlined text-[16px] ${notif.iconColor}`}>
                                                {notif.icon}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="text-xs font-semibold text-gray-900 leading-snug">{notif.title}</p>
                                                <span className="text-[10px] text-gray-400 shrink-0 mt-0.5">{notif.time}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-0.5 leading-snug">{notif.description}</p>
                                        </div>
                                        {notif.unread && (
                                            <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-black mt-1.5" />
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-2.5 border-t border-gray-100 text-center">
                            <button className="text-xs text-gray-400 hover:text-black transition-colors font-medium">
                                Ver todas as notificações
                            </button>
                        </div>
                    </div>
                </div>

                <div className="h-8 w-[1px] bg-gray-100 hidden md:block" />
                <div className="flex items-center gap-3 md:pl-2">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-sm font-semibold text-gray-900 leading-none">{user?.name || "Usuário"}</span>
                        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mt-1">
                            {user?.role === "admin" ? "Acesso Total" : "Área do Cliente"}
                        </span>
                    </div>
                    <NotionAvatar
                        name={user?.name || "Usuário"}
                        type="human"
                        gender={user?.gender}
                        size="md"
                        className="rounded-xl"
                    />
                </div>
            </div>
        </header>
    );
}
