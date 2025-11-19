import { Trash2 } from 'lucide-react';
import { HistoricalData, AUTOMATION_ROBOTS } from '../utils/dailyReportParser';
import { getSortedDates } from '../utils/historicalDataManager';

interface HistoricalSheetProps {
  historicalData: HistoricalData;
  onDelete: (dateKey: string) => void;
}

export function HistoricalSheet({ historicalData, onDelete }: HistoricalSheetProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDate = (dateKey: string) => {
    return dateKey.replace(/\./g, '/');
  };

  const sortedDates = getSortedDates(historicalData);
  let cumulativeTotal = 0;

  const handleDelete = (dateKey: string) => {
    if (confirm(`Tem certeza que deseja excluir o resultado do dia ${formatDate(dateKey)}? Esta ação é permanente.`)) {
      onDelete(dateKey);
    }
  };

  if (sortedDates.length === 0) {
    return (
      <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-8 text-center">
        <h2 className="font-['Orbitron'] text-[1.5rem] text-[#c9d1d9] mb-4">
          Planilha Histórica de Resultados
        </h2>
        <div className="text-[#8b949e] font-['Inter']">
          Nenhum resultado histórico salvo ainda. Carregue seu primeiro relatório diário!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#161b22] rounded-xl border border-[#30363d] overflow-hidden">
      {/* Header */}
      <div className="border-b border-[#30363d] p-6">
        <h2 className="font-['Orbitron'] text-[1.5rem] text-[#c9d1d9] text-center">
          Planilha Histórica de Resultados
        </h2>
      </div>

      {/* Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          {/* Table Header */}
          <thead className="bg-[#0d1117] border-b border-[#30363d]">
            <tr>
              <th className="text-left px-4 py-3 font-['Inter'] text-[0.7rem] font-semibold text-[#8b949e] uppercase tracking-wider sticky left-0 bg-[#0d1117] z-10">
                Data
              </th>
              {AUTOMATION_ROBOTS.map(robotName => (
                <th 
                  key={robotName}
                  className="text-center px-4 py-3 font-['Inter'] text-[0.7rem] font-semibold text-[#8b949e] uppercase tracking-wider whitespace-nowrap"
                >
                  {robotName}
                </th>
              ))}
              <th className="text-center px-4 py-3 font-['Inter'] text-[0.7rem] font-semibold text-[#8b949e] uppercase tracking-wider whitespace-nowrap">
                Resultado do Dia
              </th>
              <th className="text-center px-4 py-3 font-['Inter'] text-[0.7rem] font-semibold text-[#8b949e] uppercase tracking-wider whitespace-nowrap">
                Resultado Acumulado
              </th>
              <th className="text-center px-4 py-3 font-['Inter'] text-[0.7rem] font-semibold text-[#8b949e] uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#21262d]">
            {sortedDates.map((dateKey) => {
              const dayData = historicalData[dateKey];
              cumulativeTotal += dayData.totalDia;

              return (
                <tr 
                  key={dateKey}
                  className="hover:bg-[#0d1117] transition-colors duration-150"
                >
                  {/* Data */}
                  <td className="px-4 py-3 font-['Inter'] text-[0.85rem] text-[#c9d1d9] sticky left-0 bg-[#161b22] hover:bg-[#0d1117] transition-colors">
                    {formatDate(dateKey)}
                  </td>

                  {/* Resultados dos Robôs */}
                  {AUTOMATION_ROBOTS.map(robotName => {
                    const result = dayData.robots[robotName] || 0;
                    return (
                      <td 
                        key={robotName}
                        className={`px-4 py-3 text-center font-['Space_Mono'] text-[0.8rem] font-medium tabular-nums ${
                          result > 0 ? 'text-[#2ea043]' : result < 0 ? 'text-[#da3633]' : 'text-[#8b949e]'
                        }`}
                      >
                        {formatCurrency(result)}
                      </td>
                    );
                  })}

                  {/* Resultado do Dia */}
                  <td className={`px-4 py-3 text-center font-['Orbitron'] text-[0.9rem] font-bold tabular-nums ${
                    dayData.totalDia > 0 ? 'text-[#2ea043]' : dayData.totalDia < 0 ? 'text-[#da3633]' : 'text-[#c9d1d9]'
                  }`}>
                    {formatCurrency(dayData.totalDia)}
                  </td>

                  {/* Resultado Acumulado */}
                  <td className={`px-4 py-3 text-center font-['Orbitron'] text-[0.9rem] font-bold tabular-nums ${
                    cumulativeTotal > 0 ? 'text-[#2ea043]' : cumulativeTotal < 0 ? 'text-[#da3633]' : 'text-[#c9d1d9]'
                  }`}>
                    {formatCurrency(cumulativeTotal)}
                  </td>

                  {/* Ações */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDelete(dateKey)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-[#da3633]/20 text-[#da3633] hover:bg-[#da3633]/30 transition-colors"
                      title={`Excluir resultado de ${formatDate(dateKey)}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Table Footer */}
          <tfoot className="bg-[#0d1117] border-t-2 border-[#30363d]">
            <tr className="font-bold">
              <td 
                colSpan={AUTOMATION_ROBOTS.length + 1} 
                className="px-4 py-4 text-right font-['Inter'] text-[0.9rem] text-[#8b949e] uppercase tracking-wider"
              >
                Total Geral Acumulado:
              </td>
              <td className={`px-4 py-4 text-center font-['Orbitron'] text-[1.1rem] font-black tabular-nums ${
                cumulativeTotal > 0 ? 'text-[#2ea043]' : cumulativeTotal < 0 ? 'text-[#da3633]' : 'text-[#c9d1d9]'
              }`}>
                {formatCurrency(cumulativeTotal)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}