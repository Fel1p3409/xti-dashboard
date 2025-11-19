import { RobotStats } from '../utils/calculations';
import zarionLogo from '@/assets/zarion.png';

interface RobotCardsProps {
  robots: RobotStats[];
}

export function RobotCards({ robots }: RobotCardsProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {robots.map((robot, index) => (
        <div
          key={index}
          className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden hover:translate-y-[-4px] transition-all"
        >
          {/* Header com borda colorida */}
          <div className="px-4 py-3 bg-[rgba(255,255,255,0.03)] border-b border-[#30363d] flex items-center justify-between">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              {/* Logo do Robô */}
              {(() => {
                const ROBOT_LOGOS: { [key: string]: string } = {
                  'ATRION WIN': 'https://i.ibb.co/Gfn4rkTx/ATRION-WIN.png',
                  'ATRION WDO': 'https://i.ibb.co/Gfn4rkTx/ATRION-WIN.png',
                  'CRONOS WDO': 'https://i.ibb.co/ynrKMFFj/CRONOS.png',
                  'ORION WIN': 'https://i.ibb.co/GgN9Q1h/ORION.png',
                  'ZARION': zarionLogo,
                  'GIRION': ''
                };

                const findLogo = (name: string) => {
                  // busca correspondência exata ou parcial (ex: "ZARION WIN" contém "ZARION")
                  for (const key of Object.keys(ROBOT_LOGOS)) {
                    if (name === key || name.startsWith(key) || name.includes(key)) {
                      return ROBOT_LOGOS[key];
                    }
                  }
                  return null;
                };

                const logoUrl = findLogo(robot.name);

                return logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={robot.name}
                    className="w-7 h-7 object-contain rounded flex-shrink-0"
                  />
                ) : null;
              })()}
              
              <span className="text-[0.95rem] text-[#c9d1d9] font-['Orbitron'] font-bold truncate">
                {robot.name}
              </span>
            </div>
            
            <span className={`font-['Orbitron'] font-bold flex-shrink-0 ml-2 ${robot.totalProfit >= 0 ? 'text-[#2ea043]' : 'text-[#da3633]'}`}>
              {formatCurrency(robot.totalProfit)}
            </span>
          </div>

          {/* Body */}
          <div className="p-4 space-y-2 font-['Inter']">
            <div className="flex justify-between text-[0.85rem]">
              <span className="text-[#8b949e]">Trades</span>
              <span className="text-[#c9d1d9] font-medium">{robot.totalTrades}</span>
            </div>
            
            <div className="flex justify-between text-[0.85rem]">
              <span className="text-[#8b949e]">Win Rate</span>
              <span className="text-[#c9d1d9] font-medium">{robot.winRate.toFixed(1)}%</span>
            </div>

            <div className="flex justify-between text-[0.85rem]">
              <span className="text-[#8b949e]">Ganhos</span>
              <span className="text-[#2ea043] font-medium">{robot.wins}</span>
            </div>

            <div className="flex justify-between text-[0.85rem]">
              <span className="text-[#8b949e]">Perdas</span>
              <span className="text-[#da3633] font-medium">{robot.losses}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}