import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import {
  readDashboardPreferences,
  saveDashboardPreferences,
  type DashboardPreferences,
} from "../dashboardPreferences";

interface SettingsTabProps {
  showToast: (message: string) => void;
}

export default function SettingsTab({ showToast }: SettingsTabProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const activeUserId = user?.id ?? null;
  const [preferencesState, setPreferencesState] = useState<{
    ownerId: string | null;
    values: DashboardPreferences;
  }>(() => ({
    ownerId: activeUserId,
    values: readDashboardPreferences(user?.id),
  }));
  const preferences =
    preferencesState.ownerId === activeUserId
      ? preferencesState.values
      : readDashboardPreferences(user?.id);
  const setPreferences = (
    updater: (currentPreferences: DashboardPreferences) => DashboardPreferences,
  ) => {
    setPreferencesState({
      ownerId: activeUserId,
      values: updater(preferences),
    });
  };

  useEffect(() => {
    document.documentElement.dataset.motion = preferences.reducedMotion
      ? "reduced"
      : "default";
  }, [preferences.reducedMotion]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveDashboardPreferences(user?.id, preferences);
    showToast("Configurações salvas com sucesso!");
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 md:gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-primary tracking-tight">
            Configurações
          </h1>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            Gerencie as preferências da sua conta {isAdmin ? "administrativa" : "pessoal"}.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#e5e5e5] shadow-sm overflow-hidden p-4 md:p-8">
        <form onSubmit={handleSave} className="space-y-6 md:space-y-8">
          <div>
            <h3 className="text-base md:text-lg font-medium text-primary mb-4 border-b border-[#e5e5e5] pb-2">
              Perfil
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="settings-full-name"
                  className="text-sm font-medium text-gray-700"
                >
                  Nome Completo
                </label>
                <input
                  id="settings-full-name"
                  type="text"
                  className="w-full bg-gray-50 border border-border-grey rounded-lg px-4 py-2.5 md:py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                  value={user?.name || ""}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="settings-account-email"
                  className="text-sm font-medium text-gray-700"
                >
                  E-mail da Conta
                </label>
                <input
                  id="settings-account-email"
                  type="email"
                  className="w-full bg-gray-50 border border-border-grey rounded-lg px-4 py-2.5 md:py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                  value={user?.email || ""}
                  disabled
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base md:text-lg font-medium text-primary mb-4 border-b border-[#e5e5e5] pb-2">
              Preferências do Sistema
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-[#e5e5e5] rounded-lg gap-4">
                <div className="flex-1">
                  <h4 className="text-sm md:text-base font-medium text-primary">
                    Notificações Push
                  </h4>
                  <p className="text-[10px] md:text-xs text-gray-500">
                    Receber alertas de estoque e novos agendamentos.
                  </p>
                </div>
                <label
                  htmlFor="settings-push-notifications"
                  className="relative inline-flex items-center cursor-pointer shrink-0"
                >
                  <input
                    id="settings-push-notifications"
                    type="checkbox"
                    className="sr-only peer"
                    checked={preferences.notificationsEnabled}
                    onChange={(e) =>
                      setPreferences((currentPreferences) => ({
                        ...currentPreferences,
                        notificationsEnabled: e.target.checked,
                      }))
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-[#e5e5e5] rounded-lg gap-4">
                <div className="flex-1">
                  <h4 className="text-sm md:text-base font-medium text-primary">
                    Movimentos Reduzidos
                  </h4>
                  <p className="text-[10px] md:text-xs text-gray-500">
                    Diminui animações e transições do painel para uma navegação mais estável.
                  </p>
                </div>
                <label
                  htmlFor="settings-reduced-motion"
                  className="relative inline-flex items-center cursor-pointer shrink-0"
                >
                  <input
                    id="settings-reduced-motion"
                    type="checkbox"
                    className="sr-only peer"
                    checked={preferences.reducedMotion}
                    onChange={(e) =>
                      setPreferences((currentPreferences) => ({
                        ...currentPreferences,
                        reducedMotion: e.target.checked,
                      }))
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="bg-primary text-white px-6 py-3 md:py-2.5 rounded-lg text-sm font-medium hover:bg-[#4d4d4d] transition-colors w-full md:w-auto"
            >
              Salvar Preferências
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
