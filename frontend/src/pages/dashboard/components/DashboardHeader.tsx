import { useAuth } from "../../../hooks/useAuth";

type DashboardHeaderProps = {
    activeTab: string;
    globalSearch: string;
    setGlobalSearch: (search: string) => void;
    showSearch?: boolean;
};

export default function DashboardHeader({
    activeTab,
    globalSearch,
    setGlobalSearch,
    showSearch = true
}: DashboardHeaderProps) {
    const { user, getInitials } = useAuth();

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
        <header className="h-16 border-b border-gray-100 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-800 tracking-tight">
                    {getTabTitle(activeTab)}
                </h2>
                {showSearch && (activeTab === "clients" || activeTab === "pets" || activeTab === "inventory") && (
                    <div className="relative group ml-4">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg group-focus-within:text-black transition-colors">
                            search
                        </span>
                        <input
                            type="text"
                            placeholder={`Buscando em ${getTabTitle(activeTab).toLowerCase()}...`}
                            className="pl-10 pr-4 py-1.5 bg-gray-50 border-none rounded-full text-sm focus:ring-1 focus:ring-black w-64 transition-all outline-none"
                            value={globalSearch}
                            onChange={(e) => setGlobalSearch(e.target.value)}
                        />
                    </div>
                )}
            </div>

            <div className="flex items-center gap-6">
                <button className="text-gray-400 hover:text-black transition-colors relative">
                    <span className="material-symbols-outlined text-[22px]">notifications</span>
                    <span className="absolute top-0 right-0 w-2 h-2 bg-black border-2 border-white rounded-full"></span>
                </button>
                <div className="h-8 w-[1px] bg-gray-100"></div>
                <div className="flex items-center gap-3 pl-2">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-semibold text-gray-900 leading-none">
                            {user?.name || "Usuário"}
                        </span>
                        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mt-1">
                            {user?.role === "admin" ? "Acesso Total" : "Área do Cliente"}
                        </span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-sm font-bold text-gray-800 border border-gray-100 shadow-sm">
                        {user ? getInitials(user.name) : "??"}
                    </div>
                </div>
            </div>
        </header>
    );
}
