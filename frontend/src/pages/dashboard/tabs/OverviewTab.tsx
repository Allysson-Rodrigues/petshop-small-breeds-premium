interface OverviewTabProps {
  showToast: (message: string) => void;
}

export default function OverviewTab({ showToast }: OverviewTabProps) {
  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-primary tracking-tight">
          Visão Geral do Painel
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Bem-vindo de volta, veja o que está acontecendo hoje.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Card 1 */}
        <div className="bg-white p-6 rounded-xl border border-[#e5e5e5] shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-6xl text-primary">
              pets
            </span>
          </div>
          <p className="text-gray-500 text-sm font-medium">Total de Pets</p>
          <div className="flex items-end gap-2">
            <h2 className="text-3xl font-bold text-primary tracking-tight">
              524
            </h2>
            <span className="text-xs text-green-600 font-medium mb-1.5 flex items-center bg-green-50 px-1.5 py-0.5 rounded">
              <span className="material-symbols-outlined text-[14px] mr-0.5">
                trending_up
              </span>
              +12%
            </span>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white p-6 rounded-xl border border-[#e5e5e5] shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-6xl text-primary">
              payments
            </span>
          </div>
          <p className="text-gray-500 text-sm font-medium">Receita Diária</p>
          <div className="flex items-end gap-2">
            <h2 className="text-3xl font-bold text-primary tracking-tight">
              $1,240
            </h2>
            <span className="text-xs text-green-600 font-medium mb-1.5 flex items-center bg-green-50 px-1.5 py-0.5 rounded">
              <span className="material-symbols-outlined text-[14px] mr-0.5">
                trending_up
              </span>
              +5.2%
            </span>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white p-6 rounded-xl border border-[#e5e5e5] shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-6xl text-primary">
              event_available
            </span>
          </div>
          <p className="text-gray-500 text-sm font-medium">
            Agendamentos Ativos
          </p>
          <div className="flex items-end gap-2">
            <h2 className="text-3xl font-bold text-primary tracking-tight">
              18
            </h2>
            <span className="text-xs text-gray-400 font-medium mb-1.5">
              Hoje
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Appointments */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary">
              Agendamentos de Hoje
            </h2>
            <button
              className="text-sm font-medium text-gray-500 hover:text-primary transition-colors flex items-center gap-1"
              onClick={(e) => {
                e.preventDefault();
                showToast("Redirecionando para todos agendamentos...");
              }}
            >
              Ver todos{" "}
              <span className="material-symbols-outlined text-[16px]">
                arrow_forward
              </span>
            </button>
          </div>
          <div className="bg-white rounded-xl border border-[#e5e5e5] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-[#e5e5e5] text-xs uppercase text-gray-500 font-medium">
                  <tr>
                    <th className="px-6 py-4 w-1/3">Nome do Pet</th>
                    <th className="px-6 py-4">Serviço</th>
                    <th className="px-6 py-4">Horário</th>
                    <th className="px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e5e5]">
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          <img
                            alt="Golden Retriever puppy portrait"
                            className="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxyWuZta1BOyZ33xhCu-wwERl5dBf9gBjR8JxRkRrnVsk3CctwHNmiIUdm-kt0vr3d5d_5hHlqmw8e_YD3tIes2nhk5f-It088QTjRkbu8nnpJfpV4mirmp_DC70ZkG5_BwjB6dvToRYshRczmb46aldDUhlCIj3CvNtuD3jvjVzipczM8QIP_Vz7oXosyJCq66lo7ALVKAcuB0sZUpTYIQnX7L4NICnd1NpFYAJEhsJ1I8F7nyufCPXgxwDUtmGvegWoNV29TUqc"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-primary">Bella</p>
                          <p className="text-xs text-gray-400">
                            Golden Retriever
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                        Tosa
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-600">
                      10:00 AM
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Confirmado
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          <img
                            alt="French bulldog looking curious"
                            className="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCK_Gchu2mVI8m1UUlFcukeV40uiko9l__41-7EO_qvTsGcCcbHy71MFTf2lXav-z9cV_MTjkK_2NdrQYtc2DMmNRFUsA3HO8XFfOiUwBqXtLxLxpeMygS3Axdq11bCaOusmc7JjLhgrZoKTt4U6VqwHsvTln-Uq8Uxnox1OxF-8LOf5HfmpascJuEfZZ-jEkFg1ImDH_tIpZpjeTLeGekTyRI7JsCzOf0ZJXVxUgR9oNxEXZg8zfLvYIhjIIS09DIiB40DHAnwQSk"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-primary">Max</p>
                          <p className="text-xs text-gray-400">
                            French Bulldog
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        Check-up
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-600">
                      11:30 AM
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pendente
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          <img
                            alt="Grey fluffy cat"
                            className="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAs4P7Hdp-c9UG0I25m44VYoLTd79wRtMmgzXcAQDhxM9EGZPB6xnOOyF7Gr5VRBjBtsiM9U-H2UmCAv7cRmwyg7L117P7ErlHmQfXVmDofA2o24r8B-yCNijyETF-e-8x0yFzsu5OH9iEmY6jl7uaTP6YRNEzSahKcpCa4Q2bRfizGiPVN2aO-JK4r1ctIjqhYhB2Gx62yjAwn7WoTKm1_jsjp9OSeKS0SeEJ1IBGMBYa0lX1T2e6S5g4wa2qbtwjXFdu7d2DLblc"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-primary">Luna</p>
                          <p className="text-xs text-gray-400">Persian Cat</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                        Vacinação
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-600">
                      02:00 PM
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Confirmado
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          <img
                            alt="Small terrier dog portrait"
                            className="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCt6ETj9RZWY4Nv3TinfKDK740GyRj28Wv6NF7F1lo02p6HPmOGqNNZZ75pnDJkJb5vuBIseT97W0Gfsbssae-kSMuPFXu5HRBHPiStCaBAePUr75Min8p1FJEgCqs85IYfQI8ASfV9MtTVVt7c_w0k7wKplOiDHfd9io-pA8TlS9rn48-vxeHkyZtK9t7tLiEP1uDM8hlL3XnP9LKm0XXJfXr0_SrjP33zgUnlkMQxN1I8P5QfsBkScyvo9tEneow79Q91IYV0NsY"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-primary">Charlie</p>
                          <p className="text-xs text-gray-400">Terrier Mix</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                        Corte de Unhas
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-600">
                      03:15 PM
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        Concluído
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Inventory Alerts */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary">
              Alertas de Estoque
            </h2>
            <button
              className="text-sm font-medium text-gray-500 hover:text-primary transition-colors"
              onClick={(e) => {
                e.preventDefault();
                showToast("Abrindo gerenciamento de estoque...");
              }}
            >
              Gerenciar
            </button>
          </div>
          <div className="bg-white rounded-xl border border-[#e5e5e5] shadow-sm p-5 h-full flex flex-col gap-5">
            {/* Alert Item 1 */}
            <div className="flex gap-4 items-start pb-4 border-b border-[#e5e5e5] last:border-0 last:pb-0">
              <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-gray-400">
                  nutrition
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-primary text-sm truncate pr-2">
                    Ração Premium
                  </h3>
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                    BAIXO
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-3">
                  Apenas 4 pacotes restantes no estoque.
                </p>
                <button
                  className="w-full py-1.5 px-3 bg-primary text-white text-xs font-medium rounded hover:bg-[#4d4d4d] transition-colors flex items-center justify-center gap-1.5"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast("Pedido de reposição (Ração Premium) enviado!");
                  }}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    add_shopping_cart
                  </span>
                  Repor
                </button>
              </div>
            </div>

            {/* Alert Item 2 */}
            <div className="flex gap-4 items-start pb-4 border-b border-[#e5e5e5] last:border-0 last:pb-0">
              <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-gray-400">
                  soap
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-primary text-sm truncate pr-2">
                    Shampoo Orgânico
                  </h3>
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                    RESTAM 3
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-3">
                  Aroma de lavanda quase acabando.
                </p>
                <button
                  className="w-full py-1.5 px-3 bg-primary text-white text-xs font-medium rounded hover:bg-[#4d4d4d] transition-colors flex items-center justify-center gap-1.5"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast(
                      "Pedido de reposição (Shampoo Orgânico) enviado!",
                    );
                  }}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    add_shopping_cart
                  </span>
                  Repor
                </button>
              </div>
            </div>

            {/* Alert Item 3 */}
            <div className="flex gap-4 items-start pb-4 border-b border-[#e5e5e5] last:border-0 last:pb-0">
              <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-gray-400">
                  toys
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-primary text-sm truncate pr-2">
                    Brinquedo de Borracha
                  </h3>
                  <span className="text-[10px] font-bold text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded">
                    RESTAM 5
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-3">
                  Item popular, considere um pedido em massa.
                </p>
                <button
                  className="w-full py-1.5 px-3 bg-primary text-white text-xs font-medium rounded hover:bg-[#4d4d4d] transition-colors flex items-center justify-center gap-1.5"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast(
                      "Pedido de reposição (Brinquedo de Borracha) enviado!",
                    );
                  }}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    add_shopping_cart
                  </span>
                  Repor
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
