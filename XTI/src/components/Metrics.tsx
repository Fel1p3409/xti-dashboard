import { MetricsData } from '../utils/calculations';

interface MetricsProps {
  metrics: MetricsData;
}

export function Metrics({ metrics }: MetricsProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const kpis = [
    { label: 'Resultado Líquido', value: formatCurrency(metrics.netProfit), isPositive: metrics.netProfit >= 0 },
    { label: 'Profit Factor', value: metrics.profitFactor.toFixed(2), isPositive: metrics.profitFactor >= 1 },
    { label: 'Max Drawdown', value: formatCurrency(metrics.maxDrawdown), isPositive: false },
    { label: 'SQN', value: metrics.sqn.toFixed(2), isPositive: metrics.sqn >= 0 },
    { label: 'Expectativa', value: formatCurrency(metrics.avgTrade), isPositive: metrics.avgTrade >= 0 },
    { label: 'Payoff', value: metrics.payoff.toFixed(2), isPositive: metrics.payoff >= 1 },
    { label: 'Taxa de Acerto', value: `${metrics.winRate.toFixed(1)}%`, isPositive: metrics.winRate >= 50 },
  ];

  return (
    <div>
      <h2 className="font-['Orbitron'] text-[1.2rem] text-[#c9d1d9] mb-4 border-l-4 border-[#58a6ff] pl-4">
        Indicadores Chave (KPIs)
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {kpis.map((kpi, index) => (
          <div
            key={index}
            className="bg-[#161b22] rounded-xl border border-[#30363d] p-5 text-center"
          >
            <h4 className="text-[10px] text-[#8b949e] uppercase mb-2 font-['Orbitron'] leading-tight">
              {kpi.label}
            </h4>
            <div className={`text-[0.85rem] font-bold font-['Orbitron'] leading-tight text-center tabular-nums ${kpi.isPositive ? 'text-[#2ea043]' : 'text-[#da3633]'}`}>
              {kpi.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}