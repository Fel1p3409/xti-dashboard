import { Trophy, AlertTriangle, Calendar } from 'lucide-react';
import { MetricsData } from '../utils/calculations';

interface HighlightsProps {
  metrics: MetricsData;
}

export function Highlights({ metrics }: HighlightsProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Melhor Robô */}
      <div className="bg-gradient-to-br from-[#161b22] to-[#21262d] rounded-xl border border-[#30363d] p-6 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2ea043]" />
        <div className="flex items-center gap-4">
          <div className="w-[60px] h-[60px] rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center flex-shrink-0">
            <Trophy className="w-7 h-7 text-[#2ea043]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[0.85rem] text-[#8b949e] uppercase tracking-wider mb-2 font-['Orbitron']">
              Melhor Robô
            </h3>
            <div className="font-['Orbitron'] text-[1.5rem] text-[#2ea043] font-bold mb-1">
              {formatCurrency(metrics.bestRobot.value)}
            </div>
            <div className="text-[0.85rem] text-[#8b949e] truncate font-['Inter']">
              {metrics.bestRobot.name}
            </div>
          </div>
        </div>
      </div>

      {/* Pior Robô */}
      <div className="bg-gradient-to-br from-[#161b22] to-[#21262d] rounded-xl border border-[#30363d] p-6 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#da3633]" />
        <div className="flex items-center gap-4">
          <div className="w-[60px] h-[60px] rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-7 h-7 text-[#da3633]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[0.85rem] text-[#8b949e] uppercase tracking-wider mb-2 font-['Orbitron']">
              Pior Robô
            </h3>
            <div className="font-['Orbitron'] text-[1.5rem] text-[#da3633] font-bold mb-1">
              {formatCurrency(metrics.worstRobot.value)}
            </div>
            <div className="text-[0.85rem] text-[#8b949e] truncate font-['Inter']">
              {metrics.worstRobot.name}
            </div>
          </div>
        </div>
      </div>

      {/* Melhor Mês */}
      <div className="bg-gradient-to-br from-[#161b22] to-[#21262d] rounded-xl border border-[#30363d] p-6 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#58a6ff]" />
        <div className="flex items-center gap-4">
          <div className="w-[60px] h-[60px] rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center flex-shrink-0">
            <Calendar className="w-7 h-7 text-[#58a6ff]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[0.85rem] text-[#8b949e] uppercase tracking-wider mb-2 font-['Orbitron']">
              Melhor Mês
            </h3>
            <div className="font-['Orbitron'] text-[1.5rem] text-[#2ea043] font-bold mb-1">
              {formatCurrency(metrics.bestMonth.value)}
            </div>
            <div className="text-[0.85rem] text-[#8b949e] truncate font-['Inter']">
              {metrics.bestMonth.name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
