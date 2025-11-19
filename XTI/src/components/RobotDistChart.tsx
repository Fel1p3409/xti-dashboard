import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { RobotStats } from '../utils/calculations';

interface RobotDistChartProps {
  data: RobotStats[];
}

// Array de cores vibrantes
const COLORS = ['#2ea043', '#58a6ff', '#f59e0b', '#a855f7', '#da3633', '#ec4899', '#14b8a6', '#f97316', '#10b981', '#8b5cf6'];

// Mapeamento de cores específicas por robô
const ROBOT_COLOR_MAP: { [key: string]: string } = {
  'ATRION WDO': '#2ea043',
  'ATRION WIN': '#58a6ff',
  'CRONOS WDO': '#f59e0b',
  'ORION WIN': '#a855f7',
  'ZARION WIN': '#da3633',
  'ZARION': '#da3633',
};

const getColorForRobot = (robotName: string, index: number): string => {
  // Busca exata
  if (ROBOT_COLOR_MAP[robotName]) {
    return ROBOT_COLOR_MAP[robotName];
  }
  
  // Busca parcial
  const normalizedName = robotName.toUpperCase();
  for (const [key, color] of Object.entries(ROBOT_COLOR_MAP)) {
    if (normalizedName.includes(key.toUpperCase())) {
      return color;
    }
  }
  
  // Fallback por índice
  return COLORS[index % COLORS.length];
};

export function RobotDistChart({ data }: RobotDistChartProps) {
  const chartData = data.map((robot) => ({
    name: robot.name,
    value: Math.abs(robot.totalProfit)
  }));

  return (
    <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-6 h-full min-h-[720px] flex flex-col">
      <h3 className="font-['Orbitron'] text-[1.1rem] text-[#c9d1d9] mb-6 pb-4 border-b border-[#30363d] flex items-center justify-between">
        <span>Distribuição de Lucro por Robô</span>
        <span className="text-[0.75rem] text-[#8b949e] font-['Inter'] font-normal">
          Análise de Performance
        </span>
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start flex-1">
        {/* Gráfico Donut */}
        <div className="relative h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={135}
                innerRadius={85}
                dataKey="value"
                nameKey="name"
                isAnimationActive={true}
                animationDuration={1200}
                animationBegin={100}
                paddingAngle={3}
                minAngle={5}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getColorForRobot(entry.name, index)}
                    stroke="#0d1117"
                    strokeWidth={3}
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </Pie>
              
              {/* Centro do donut com total */}
              <text
                x="50%"
                y="50%"
                dy={-15}
                textAnchor="middle"
                dominantBaseline="central"
                style={{
                  fontSize: '12px',
                  fontFamily: 'Inter',
                  fontWeight: '500',
                  fill: '#8b949e',
                  letterSpacing: '1px'
                }}
              >
                TOTAL GERAL
              </text>
              <text
                x="50%"
                y="50%"
                dy={12}
                textAnchor="middle"
                dominantBaseline="central"
                style={{
                  fontSize: '22px',
                  fontFamily: 'Orbitron',
                  fontWeight: '700',
                  fill: '#2ea043',
                  letterSpacing: '0.5px'
                }}
              >
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(chartData.reduce((sum, item) => sum + item.value, 0))}
              </text>
              
              <Tooltip
                cursor={false}
                contentStyle={{
                  backgroundColor: '#161b22',
                  border: '1px solid #30363d',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontFamily: 'Inter',
                  padding: '12px 16px',
                  fontSize: '13px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                }}
                labelStyle={{ 
                  color: '#ffffff', 
                  fontFamily: 'Orbitron', 
                  fontWeight: '700',
                  marginBottom: '6px',
                  fontSize: '14px'
                }}
                itemStyle={{ 
                  color: '#c9d1d9',
                  padding: '2px 0',
                  fontSize: '13px'
                }}
                formatter={(value: number, name: string, props: any) => {
                  const percent = (props.percent * 100).toFixed(2);
                  return [
                    new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(value) + ` (${percent}%)`,
                    'Lucro'
                  ];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legenda Customizada - Tabela de Robôs */}
        <div className="space-y-3">
          <div className="text-[0.8rem] font-['Orbitron'] text-[#8b949e] mb-4 pb-2 border-b border-[#30363d]">
            ROBÔS ATIVOS
          </div>
          {chartData.map((entry, index) => {
            const total = chartData.reduce((sum, item) => sum + item.value, 0);
            const percentage = ((entry.value / total) * 100).toFixed(1);
            
            return (
              <div 
                key={`legend-${index}`}
                className="group bg-[#0d1117] border border-[#30363d] rounded-lg p-3 hover:border-[#58a6ff] transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0" 
                      style={{ 
                        backgroundColor: getColorForRobot(entry.name, index),
                        boxShadow: `0 0 8px ${getColorForRobot(entry.name, index)}40`
                      }}
                    />
                    <span className="text-[0.85rem] font-['Orbitron'] font-semibold text-[#c9d1d9]">
                      {entry.name}
                    </span>
                  </div>
                  <span className="text-[0.95rem] font-['Orbitron'] font-bold text-[#2ea043] tabular-nums">
                    {percentage}%
                  </span>
                </div>
                <div className="text-[0.8rem] font-['Inter'] text-[#8b949e] tabular-nums">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(entry.value)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}