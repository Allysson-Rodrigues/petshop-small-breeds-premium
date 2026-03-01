import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import NotionAvatar from "../../pages/dashboard/components/NotionAvatar";

export default function SidebarUser({ isCollapsed }: { isCollapsed?: boolean }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div
            className="p-4 pb-8 lg:pb-4 border-t border-white/10 flex items-center justify-between overflow-hidden shrink-0"
        >
            <div className="flex items-center gap-3 whitespace-nowrap">
                <NotionAvatar
                    name={user.name}
                    type="human"
                    gender={user.gender}
                    size="md"
                    className="rounded-full shadow-sm"
                />
                <div className={`flex flex-col transition-opacity duration-500 ease-in-out ${isCollapsed ? "opacity-0 invisible w-0" : "opacity-100"}`}>
                    <span className="text-xs font-medium text-white truncate max-w-[120px]">
                        {user.name}
                    </span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                        {user.role === "admin" ? "Admin" : "Cliente"}
                    </span>
                </div>
            </div>

            <button
                onClick={handleLogout}
                className={`text-gray-400 hover:text-red-400 transition-all p-2 hover:bg-red-400/10 rounded-lg flex items-center justify-center shrink-0 ${isCollapsed ? "hidden" : "block"}`}
                title="Sair"
            >
                <span className="material-symbols-outlined text-[22px]">
                    logout
                </span>
            </button>
        </div>
    );
}
