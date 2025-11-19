interface HeatMapProps {
  data: { [year: string]: number[] };
}

export function HeatMap({ data }: HeatMapProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL', 
      maximumFractionDigits: 0 
    });
  };

  const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
  const years = Object.keys(data).sort().reverse();

  return (
    <div className="bg-[#161b22] rounded-xl border border-[#30363d] overflow-x-auto p-6">
      <table className="w-full min-w-[800px] border-collapse">
        <thead>
          <tr className="border-b border-[#30363d]">
            <th className="px-4 py-4 text-left text-[0.8rem] text-[#8b949e] uppercase tracking-wider font-['Orbitron'] font-semibold">
              Ano
            </th>
            {months.map(month => (
              <th key={month} className="px-3 py-4 text-center text-[0.8rem] text-[#8b949e] uppercase tracking-wider font-['Orbitron'] font-semibold">
                {month}
              </th>
            ))}
            <th className="px-4 py-4 text-center text-[0.8rem] text-[#8b949e] uppercase tracking-wider font-['Orbitron'] font-semibold border-l-2 border-[#30363d]">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {years.map(year => {
            const yearTotal = data[year].reduce((sum, val) => sum + val, 0);
            
            return (
              <tr key={year} className="border-b border-[#30363d]">
                <td className="px-4 py-3 text-[#c9d1d9] font-['Inter'] font-bold">
                  {year}
                </td>
                {data[year].map((value, index) => {
                  const cellBg = value > 0 
                    ? 'bg-[rgba(46,160,67,0.15)]' 
                    : value < 0 
                    ? 'bg-[rgba(218,54,51,0.15)]' 
                    : '';
                  
                  const cellText = value > 0
                    ? 'text-[#4ade80]'
                    : value < 0
                    ? 'text-[#f87171]'
                    : 'text-[#8b949e]';
                  
                  return (
                    <td key={index} className={`px-3 py-3 text-center text-[0.9rem] font-['Inter'] font-semibold ${cellBg} ${cellText}`}>
                      {value !== 0 ? formatCurrency(value) : '-'}
                    </td>
                  );
                })}
                <td className={`px-4 py-3 text-center font-['Inter'] font-bold border-l-2 border-[#30363d] ${yearTotal >= 0 ? 'text-[#2ea043]' : 'text-[#da3633]'}`}>
                  {formatCurrency(yearTotal)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
