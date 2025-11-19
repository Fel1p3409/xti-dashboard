import { Trade } from '../utils/fileParser';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface TradesTableProps {
  trades: Trade[];
}

// Mapeamento de cores para badges de robôs
const ROBOT_BADGE_COLORS: { [key: string]: { bg: string; text: string; border: string } } = {
  'CRONOS WDO': { bg: '#f59e0b20', text: '#f59e0b', border: '#f59e0b40' },
  'ZARION WIN': { bg: '#da363320', text: '#da3633', border: '#da363340' },
  'ATRION WDO': { bg: '#2ea04320', text: '#2ea043', border: '#2ea04340' },
  'ATRION WIN': { bg: '#58a6ff20', text: '#58a6ff', border: '#58a6ff40' },
  'GIRION': { bg: '#ec489920', text: '#ec4899', border: '#ec489940' },
  'ORION WIN': { bg: '#a855f720', text: '#a855f7', border: '#a855f740' },
};

const getBadgeColors = (robotName: string) => {
  const normalized = robotName.toUpperCase();
  for (const [key, colors] of Object.entries(ROBOT_BADGE_COLORS)) {
    if (normalized.includes(key.toUpperCase())) {
      return colors;
    }
  }
  return { bg: '#58a6ff20', text: '#58a6ff', border: '#58a6ff40' };
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month} ${hours}:${minutes}`;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const formatVolume = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

export function TradesTable({ trades }: TradesTableProps) {
  // Ordena trades por data (mais recente primeiro)
  const sortedTrades = [...trades].sort((a, b) => 
    new Date(b.openTime).getTime() - new Date(a.openTime).getTime()
  );

  return (
    <div className="bg-[#161b22] rounded-xl border border-[#30363d] overflow-hidden">
      {/* Header */}
      <div className="border-b border-[#30363d] p-6">
        <h3 className="font-['Orbitron'] text-[1.1rem] text-[#c9d1d9] flex items-center justify-between">
          <span>Histórico de Operações</span>
          <span className="text-[0.75rem] text-[#8b949e] font-['Inter'] font-normal">
            {sortedTrades.length} operações registradas
          </span>
        </h3>
      </div>

      {/* Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Table Header */}
          <thead className="bg-[#0d1117] border-b border-[#30363d] sticky top-0 z-10">
            <tr>
              <th className="text-left px-4 py-3 font-['Inter'] text-[0.7rem] font-semibold text-[#8b949e] uppercase tracking-wider w-[10%]">
                Identificação
              </th>
              <th className="text-left px-4 py-3 font-['Inter'] text-[0.7rem] font-semibold text-[#8b949e] uppercase tracking-wider w-[20%]">
                Contexto
              </th>
              <th className="text-center px-4 py-3 font-['Inter'] text-[0.7rem] font-semibold text-[#8b949e] uppercase tracking-wider w-[10%]">
                Operação
              </th>
              <th className="text-right px-4 py-3 font-['Inter'] text-[0.7rem] font-semibold text-[#8b949e] uppercase tracking-wider w-[30%]">
                Financeiro
              </th>
              <th className="text-right px-4 py-3 font-['Inter'] text-[0.7rem] font-semibold text-[#8b949e] uppercase tracking-wider w-[20%]">
                Custos/Detalhes
              </th>
              <th className="text-left px-4 py-3 font-['Inter'] text-[0.7rem] font-semibold text-[#8b949e] uppercase tracking-wider w-[10%]">
                Comentários
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#21262d]">
            {sortedTrades.map((trade, index) => {
              const badgeColors = getBadgeColors(trade.robot || 'Desconhecido');
              const isProfit = trade.profit >= 0;
              
              return (
                <tr 
                  key={`${trade.ticket}-${index}`}
                  className="hover:bg-[#0d1117] transition-colors duration-150"
                >
                  {/* Identificação */}
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <div className="font-['Inter'] text-[0.75rem] text-[#8b949e] tabular-nums">
                        #{trade.ticket}
                      </div>
                      <div className="font-['Inter'] text-[0.7rem] text-[#6e7681]">
                        ID: {trade.positionId || 'N/A'}
                      </div>
                    </div>
                  </td>

                  {/* Contexto */}
                  <td className="px-4 py-3">
                    <div className="space-y-2">
                      <div className="font-['Inter'] text-[0.75rem] text-[#c9d1d9]">
                        {formatDate(trade.openTime)}
                      </div>
                      <div 
                        className="inline-flex items-center px-2 py-0.5 rounded-md font-['Orbitron'] text-[0.65rem] font-semibold"
                        style={{
                          backgroundColor: badgeColors.bg,
                          color: badgeColors.text,
                          border: `1px solid ${badgeColors.border}`
                        }}
                      >
                        {trade.robot || 'N/A'}
                      </div>
                      <div className="font-['Inter'] text-[0.7rem] text-[#8b949e]">
                        {trade.symbol}
                      </div>
                    </div>
                  </td>

                  {/* Operação */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        {trade.type === 'buy' ? (
                          <>
                            <ArrowUpCircle className="w-4 h-4 text-[#2ea043]" />
                            <span className="font-['Inter'] text-[0.75rem] font-semibold text-[#2ea043]">
                              COMPRA
                            </span>
                          </>
                        ) : (
                          <>
                            <ArrowDownCircle className="w-4 h-4 text-[#da3633]" />
                            <span className="font-['Inter'] text-[0.75rem] font-semibold text-[#da3633]">
                              VENDA
                            </span>
                          </>
                        )}
                      </div>
                      <div className="font-['Space_Mono'] text-[0.7rem] text-[#8b949e] tabular-nums">
                        Vol: {formatVolume(trade.volume)}
                      </div>
                    </div>
                  </td>

                  {/* Financeiro */}
                  <td className="px-4 py-3">
                    <div className="space-y-1.5 text-right">
                      <div className="space-y-0.5">
                        <div className="font-['Inter'] text-[0.65rem] text-[#6e7681]">
                          Abertura
                        </div>
                        <div className="font-['Space_Mono'] text-[0.75rem] text-[#c9d1d9] tabular-nums">
                          {formatCurrency(trade.openPrice)}
                        </div>
                      </div>
                      <div className="space-y-0.5">
                        <div className="font-['Inter'] text-[0.65rem] text-[#6e7681]">
                          Fechamento
                        </div>
                        <div className="font-['Space_Mono'] text-[0.75rem] text-[#c9d1d9] tabular-nums">
                          {formatCurrency(trade.closePrice)}
                        </div>
                      </div>
                      <div className="pt-1.5 mt-1.5 border-t border-[#30363d]">
                        <div className="font-['Inter'] text-[0.65rem] text-[#6e7681] mb-1">
                          RESULTADO LÍQUIDO
                        </div>
                        <div 
                          className={`font-['Orbitron'] text-[0.9rem] font-bold tabular-nums ${
                            isProfit ? 'text-[#2ea043]' : 'text-[#da3633]'
                          }`}
                        >
                          {formatCurrency(trade.profit)}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Custos/Detalhes */}
                  <td className="px-4 py-3">
                    <div className="space-y-1.5 text-right">
                      <div className="flex justify-between items-center">
                        <span className="font-['Inter'] text-[0.7rem] text-[#6e7681]">
                          Swap:
                        </span>
                        <span className="font-['Space_Mono'] text-[0.7rem] text-[#8b949e] tabular-nums">
                          {formatCurrency(trade.swap)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-['Inter'] text-[0.7rem] text-[#6e7681]">
                          Comissão:
                        </span>
                        <span className="font-['Space_Mono'] text-[0.7rem] text-[#8b949e] tabular-nums">
                          {formatCurrency(trade.commission)}
                        </span>
                      </div>
                      {trade.magic && (
                        <div className="flex justify-between items-center pt-1.5 mt-1.5 border-t border-[#21262d]">
                          <span className="font-['Inter'] text-[0.7rem] text-[#6e7681]">
                            Magic:
                          </span>
                          <span className="font-['Space_Mono'] text-[0.7rem] text-[#8b949e] tabular-nums">
                            {trade.magic}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Comentários */}
                  <td className="px-4 py-3">
                    <div 
                      className="font-['Inter'] text-[0.7rem] text-[#8b949e] truncate max-w-[150px]"
                      title={trade.comment || 'Sem comentários'}
                    >
                      {trade.comment || '-'}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {sortedTrades.length === 0 && (
        <div className="p-12 text-center">
          <div className="font-['Inter'] text-[0.9rem] text-[#8b949e]">
            Nenhuma operação encontrada
          </div>
        </div>
      )}
    </div>
  );
}