import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface WeekdayChartProps {
  data: number[];
}

export function WeekdayChart({ data }: WeekdayChartProps) {
  const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  const chartData = weekdays.map((day, index) => ({
    day,
    value: data[index] || 0
  }));

  return (
    <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-6 h-full min-h-[720px] flex flex-col">
      <h3 className="font-['Orbitron'] text-[1.1rem] text-[#c9d1d9] mb-6 pb-4 border-b border-[#30363d] flex items-center justify-between">
        <span>Performance por Dia da Semana</span>
        <span className="text-[0.75rem] text-[#8b949e] font-['Inter'] font-normal">
          Análise Semanal
        </span>
      </h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
            <XAxis 
              dataKey="day" 
              stroke="#c9d1d9"
              tick={{ fill: '#c9d1d9', fontSize: 12, fontFamily: 'Inter' }}
            />
            <YAxis 
              stroke="#c9d1d9"
              tick={{ fill: '#c9d1d9', fontSize: 12, fontFamily: 'Inter' }}
              tickFormatter={(value) => {
                return new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(value);
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#161b22',
                border: '1px solid #30363d',
                borderRadius: '12px',
                color: '#ffffff',
                fontFamily: 'Inter'
              }}
              labelStyle={{ color: '#ffffff', fontFamily: 'Inter', fontWeight: '600' }}
              itemStyle={{ color: '#ffffff' }}
              formatter={(value: number) => {
                return new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(value);
              }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.value >= 0 ? '#2ea043' : '#da3633'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}