import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface EquityChartProps {
  data: { date: string; equity: number; drawdown: number }[];
}

export function EquityChart({ data }: EquityChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-6 h-[400px] flex items-center justify-center">
        <p className="text-[#8b949e] font-['Inter']">Nenhum dado disponível</p>
      </div>
    );
  }

  return (
    <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-6">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart 
          data={data} 
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
          <XAxis 
            dataKey="date" 
            stroke="#c9d1d9"
            tick={{ fill: '#c9d1d9', fontSize: 12, fontFamily: 'Inter' }}
            tickLine={{ stroke: '#30363d' }}
          />
          <YAxis 
            stroke="#c9d1d9"
            tick={{ fill: '#c9d1d9', fontSize: 12, fontFamily: 'Inter' }}
            tickLine={{ stroke: '#30363d' }}
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
            cursor={{ stroke: '#8b949e', strokeWidth: 1, strokeDasharray: '3 3' }}
            contentStyle={{
              backgroundColor: '#161b22',
              border: '1px solid #30363d',
              borderRadius: '12px',
              color: '#ffffff',
              fontFamily: 'Inter',
              padding: '12px'
            }}
            labelStyle={{ color: '#ffffff', fontFamily: 'Inter', fontWeight: '600' }}
            itemStyle={{ color: '#ffffff' }}
            formatter={(value: number) => {
              return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(value);
            }}
            animationDuration={0}
          />
          <Legend 
            wrapperStyle={{ 
              color: '#c9d1d9', 
              fontFamily: 'Inter',
              paddingTop: '20px' 
            }}
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey="equity"
            stroke="#2ea043"
            strokeWidth={2.5}
            name="Saldo"
            dot={false}
            activeDot={{ r: 4, fill: '#2ea043', stroke: '#0d1117', strokeWidth: 2 }}
            isAnimationActive={true}
            animationDuration={800}
            animationEasing="ease-in-out"
          />
          <Line
            type="monotone"
            dataKey="drawdown"
            stroke="#da3633"
            strokeWidth={2.5}
            name="Drawdown"
            dot={false}
            activeDot={{ r: 4, fill: '#da3633', stroke: '#0d1117', strokeWidth: 2 }}
            isAnimationActive={true}
            animationDuration={800}
            animationEasing="ease-in-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}