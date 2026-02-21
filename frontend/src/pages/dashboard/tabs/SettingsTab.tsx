import { useState } from "react";
import { authService } from "../../../services/authService";

interface SettingsTabProps {
  showToast: (message: string) => void;
}

export default function SettingsTab({ showToast }: SettingsTabProps) {
  const user = authService.getUser();
  const isAdmin = user?.role === "admin";
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Configurações salvas com sucesso!");
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">
            Configurações
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Gerencie as preferências da sua conta {isAdmin ? "administrativa" : "pessoal"}.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#e5e5e5] shadow-sm overflow-hidden p-8">
        <form onSubmit={handleSave} className="space-y-8">
          <div>
            <h3 className="text-lg font-medium text-primary mb-4 border-b border-[#e5e5e5] pb-2">
              Perfil
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Nome Completo
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-50 border border-border-grey rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                  value={user?.name || ""}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  E-mail da Conta
                </label>
                <input
                  type="email"
                  className="w-full bg-gray-50 border border-border-grey rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                  value={user?.email || ""}
                  disabled
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-primary mb-4 border-b border-[#e5e5e5] pb-2">
              Preferências do Sistema
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-[#e5e5e5] rounded-lg">
                <div>
                  <h4 className="font-medium text-primary">
                    Notificações Push
                  </h4>
                  <p className="text-xs text-gray-500">
                    Receber alertas de estoque e novos agendamentos.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-[#e5e5e5] rounded-lg">
                <div>
                  <h4 className="font-medium text-primary">
                    Tema da Interface
                  </h4>
                  <p className="text-xs text-gray-500">
                    Forçar esquema escuro ou claro (mockup visual).
                  </p>
                </div>
                <select
                  className="bg-white border border-[#e5e5e5] rounded-lg text-sm px-3 py-1.5 focus:ring-1 focus:ring-primary outline-none"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                >
                  <option value="light">Sistema (Claro)</option>
                  <option value="dark">Escuro</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#4d4d4d] transition-colors"
            >
              Salvar Preferências
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
