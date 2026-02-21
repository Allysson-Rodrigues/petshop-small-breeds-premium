import { useAuth } from "../../hooks/useAuth";

export default function SidebarUser() {
    const { user, getInitials } = useAuth();

    if (!user) return null;

    return (
        <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center text-xs font-bold text-white uppercase">
                    {getInitials(user.name)}
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-medium text-white truncate max-w-[140px]">
                        {user.name}
                    </span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                        {user.role === "admin" ? "Admin Geral" : "Cliente"}
                    </span>
                </div>
            </div>
        </div>
    );
}
