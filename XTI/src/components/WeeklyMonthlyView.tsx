import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, TrendingUp, Calendar } from 'lucide-react';
import { HistoricalData, AUTOMATION_ROBOTS } from '../utils/dailyReportParser';
import { getSortedDates } from '../utils/historicalDataManager';
import zarionLogo from '@/assets/zarion.png';

interface WeeklyMonthlyViewProps {
  historicalData: HistoricalData;
}

interface CalendarDay {
  day: number;
  dateKey: string | null;
  total: number | null;
  hasOperation: boolean;
}

interface MonthData {
  monthKey: string;
  monthName: string;
  year: string;
  totalMonth: number;
  calendarDays: CalendarDay[][];
  robotTotals: { [robot: string]: number };
  totalDays: number;
}

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const WEEKDAY_NAMES = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

export function WeeklyMonthlyView({ historicalData }: WeeklyMonthlyViewProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Cria calendário completo do mês
  const createMonthCalendar = (monthKey: string, operationDays: Map<string, number>): CalendarDay[][] => {
    const [month, year] = monthKey.split('.');
    const monthIndex = parseInt(month) - 1;
    const yearNum = parseInt(year);

    // Primeiro e último dia do mês
    const firstDay = new Date(yearNum, monthIndex, 1);
    const lastDay = new Date(yearNum, monthIndex + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Domingo

    const weeks: CalendarDay[][] = [];
    let currentWeek: CalendarDay[] = [];

    // Preenche dias em branco antes do primeiro dia
    for (let i = 0; i < startingDayOfWeek; i++) {
      currentWeek.push({
        day: 0,
        dateKey: null,
        total: null,
        hasOperation: false
      });
    }

    // Preenche os dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${String(day).padStart(2, '0')}.${month}.${year}`;
      const hasOperation = operationDays.has(dateKey);
      const total = hasOperation ? operationDays.get(dateKey)! : null;

      currentWeek.push({
        day,
        dateKey: hasOperation ? dateKey : null,
        total,
        hasOperation
      });

      // Se é sábado ou último dia do mês, fecha a semana
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Completa a última semana com dias em branco
    while (currentWeek.length > 0 && currentWeek.length < 7) {
      currentWeek.push({
        day: 0,
        dateKey: null,
        total: null,
        hasOperation: false
      });
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  };

  // Organiza dados por mês
  const organizeByMonth = (): MonthData[] => {
    const sortedDates = getSortedDates(historicalData);
    const monthsMap = new Map<string, MonthData>();

    // Agrupa operações por mês
    sortedDates.forEach(dateKey => {
      const [day, month, year] = dateKey.split('.');
      const monthKey = `${month}.${year}`;
      const monthIndex = parseInt(month) - 1;
      const monthName = MONTH_NAMES[monthIndex];

      if (!monthsMap.has(monthKey)) {
        monthsMap.set(monthKey, {
          monthKey,
          monthName,
          year,
          totalMonth: 0,
          calendarDays: [],
          robotTotals: Object.fromEntries(AUTOMATION_ROBOTS.map(r => [r, 0])),
          totalDays: 0
        });
      }

      const monthData = monthsMap.get(monthKey)!;
      const dayData = historicalData[dateKey];
      
      monthData.totalMonth += dayData.totalDia;
      monthData.totalDays++;
      
      AUTOMATION_ROBOTS.forEach(robot => {
        monthData.robotTotals[robot] += dayData.robots[robot] || 0;
      });
    });

    // Cria calendário para cada mês
    monthsMap.forEach((monthData, monthKey) => {
      const operationDays = new Map<string, number>();
      
      sortedDates
        .filter(d => {
          const [, m, y] = d.split('.');
          return `${m}.${y}` === monthKey;
        })
        .forEach(dateKey => {
          operationDays.set(dateKey, historicalData[dateKey].totalDia);
        });

      monthData.calendarDays = createMonthCalendar(monthKey, operationDays);
    });

    return Array.from(monthsMap.values()).reverse();
  };

  const monthsData = organizeByMonth();
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());

  // Atualiza meses expandidos quando historicalData mudar
  useEffect(() => {
    console.log('📅 WeeklyMonthlyView - historicalData mudou:', historicalData);
    console.log('📊 Meses disponíveis:', monthsData.map(m => m.monthKey));
    // Expande todos os meses automaticamente
    setExpandedMonths(new Set(monthsData.map(m => m.monthKey)));
  }, [JSON.stringify(Object.keys(historicalData))]);

  const toggleMonth = (monthKey: string) => {
    const newExpanded = new Set(expandedMonths);
    if (newExpanded.has(monthKey)) {
      newExpanded.delete(monthKey);
    } else {
      newExpanded.add(monthKey);
    }
    setExpandedMonths(newExpanded);
  };

  return (
    <div className="space-y-6">
      {monthsData.map(month => (
        <div
          key={month.monthKey}
          className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl shadow-purple-500/10"
        >
          {/* Header do Mês - Soft & Friendly */}
          <button
            onClick={() => toggleMonth(month.monthKey)}
            className="w-full p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/5 transition-all duration-300 group backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 sm:gap-5 w-full sm:w-auto">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center backdrop-blur-md transition-all duration-300 flex-shrink-0 ${
                month.totalMonth >= 0 ? 'bg-gradient-to-br from-emerald-400/20 to-teal-400/20 shadow-lg shadow-emerald-500/20' : 'bg-gradient-to-br from-rose-400/20 to-pink-400/20 shadow-lg shadow-rose-500/20'
              }`}>
                <TrendingUp className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors ${
                  month.totalMonth >= 0 ? 'text-emerald-300' : 'text-rose-300'
                }`} />
              </div>
              <div className="text-left flex-1 min-w-0">
                <h3 className="font-['Orbitron'] text-xl sm:text-2xl text-white/90 mb-1 group-hover:text-white transition-colors">
                  {month.monthName} / {month.year}
                </h3>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-300/60 flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-white/50 truncate">
                    {month.totalDays} {month.totalDays === 1 ? 'dia operado' : 'dias operados'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 w-full sm:w-auto">
              {/* Logo XTRADERS - Ao lado esquerdo do resultado */}
              <div className="opacity-90 group-hover:opacity-100 transition-all duration-300">
                <img 
                  src="https://i.ibb.co/jswt9pR/LOGO-XTRADERS-Intelligence-1-1.png" 
                  alt="XTRADERS Intelligence"
                  className="w-20 h-auto sm:w-28 brightness-110 drop-shadow-lg"
                />
              </div>
              
              <div className={`font-['Orbitron'] text-2xl sm:text-4xl font-bold transition-all ${
                month.totalMonth >= 0 ? 'text-emerald-300' : 'text-rose-300'
              }`}>
                {formatCurrency(month.totalMonth)}
              </div>
              <div className={`transition-transform duration-300 flex-shrink-0 ${expandedMonths.has(month.monthKey) ? 'rotate-180' : ''}`}>
                <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-white/40 group-hover:text-white/70 transition-colors" />
              </div>
            </div>
          </button>

          {/* Conteúdo Expandido */}
          {expandedMonths.has(month.monthKey) && (
            <div className="border-t border-white/10">
              {/* Resultado por Robô - Soft Style */}
              <div className="px-3 sm:px-6 py-4 sm:py-5 bg-[#0d1117]">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="w-1 h-4 sm:h-5 bg-[#2ea043] rounded-full" />
                  <h4 className="font-['Orbitron'] text-sm sm:text-base text-[#c9d1d9] uppercase tracking-wider">
                    Resultado por Robô
                  </h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
                  {AUTOMATION_ROBOTS.map(robot => {
                    const total = month.robotTotals[robot];
                    return (
                      <div 
                        key={robot} 
                        className={`rounded-xl p-3 sm:p-4 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 ${
                          total >= 0 
                            ? 'bg-[#0d1117] border-[#2ea043] hover:shadow-[0_0_20px_rgba(46,160,67,0.3)]' 
                            : total < 0
                            ? 'bg-[#0d1117] border-[#da3633] hover:shadow-[0_0_20px_rgba(218,54,51,0.3)]'
                            : 'bg-[#161b22] border-[#30363d] hover:border-[#484f58]'
                        }`}
                      >
                        <div className="text-[10px] sm:text-xs text-[#8b949e] mb-1.5 sm:mb-2 font-['Inter'] uppercase tracking-wide font-semibold truncate">
                          {robot}
                        </div>
                        <div className={`font-['Orbitron'] text-xs sm:text-sm font-bold ${
                          total >= 0 ? 'text-[#2ea043]' : 'text-[#da3633]'
                        }`}>
                          {formatCurrency(total)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Calendário Mensal - Layout Visual com Cards */}
              <div className="px-3 sm:px-6 py-4 sm:py-6 bg-[#0d1117]">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="w-1 h-4 sm:h-5 bg-[#2ea043] rounded-full" />
                  <h4 className="font-['Orbitron'] text-sm sm:text-base text-[#c9d1d9] uppercase tracking-wider">
                    Calendário do Mês
                  </h4>
                </div>

                {/* Header dos Dias da Semana */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-3 mb-1 sm:mb-2">
                  {WEEKDAY_NAMES.map(day => (
                    <div
                      key={day}
                      className="text-center font-['Orbitron'] text-[10px] sm:text-xs text-[#8b949e] uppercase tracking-widest py-1 sm:py-2 font-semibold"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Grid de Dias - Cards Visuais */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-3">
                  {(() => {
                    // Mapeamento de logos dos robôs
                    const ROBOT_LOGOS: { [key: string]: string } = {
                      'ATRION WIN': 'https://i.ibb.co/Gfn4rkTx/ATRION-WIN.png',
                      'ATRION WDO': 'https://i.ibb.co/Gfn4rkTx/ATRION-WIN.png',
                      'CRONOS WDO': 'https://i.ibb.co/ynrKMFFj/CRONOS.png',
                      'ORION WIN': 'https://i.ibb.co/GgN9Q1h/ORION.png',
                      'ZARION': zarionLogo,
                      'GIRION': ''
                    };

                    return month.calendarDays.flat().map((day, idx) => {
                      if (!day.hasOperation && day.day === 0) {
                        // Dia em branco (fora do mês)
                        return (
                          <div
                            key={idx}
                            className="aspect-square bg-transparent"
                          />
                        );
                      }

                      if (!day.hasOperation) {
                        // Dia do mês sem operação - Card neutro
                        return (
                          <div
                            key={idx}
                            className="aspect-square bg-[#161b22] border border-[#21262d] rounded-lg sm:rounded-xl md:rounded-2xl p-1.5 sm:p-2 md:p-3 flex flex-col justify-between transition-all duration-200 hover:border-[#30363d] hover:transform hover:-translate-y-1 hover:shadow-lg"
                          >
                            <div className="font-['Orbitron'] text-[10px] sm:text-xs md:text-sm text-[#484f58] font-medium">
                              {day.day}
                            </div>
                            <div className="text-right text-[#30363d] text-sm sm:text-base md:text-lg font-bold">
                              —
                            </div>
                          </div>
                        );
                      }

                      // Dia com operação - Card colorido (Dark Mode)
                      const dayData = historicalData[day.dateKey!];
                      const isPositive = day.total! >= 0;

                      return (
                        <div
                          key={idx}
                          className={`group aspect-square rounded-lg sm:rounded-xl md:rounded-2xl p-1.5 sm:p-2 md:p-3 flex flex-col justify-between transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-xl cursor-pointer relative ${
                            isPositive 
                              ? 'bg-[#0d1117] border-2 border-[#2ea043] hover:shadow-[0_0_20px_rgba(46,160,67,0.3)]' 
                              : 'bg-[#0d1117] border-2 border-[#da3633] hover:shadow-[0_0_20px_rgba(218,54,51,0.3)]'
                          }`}
                        >
                          {/* Número do Dia */}
                          <div className={`font-['Orbitron'] text-[10px] sm:text-xs md:text-sm font-medium ${
                            isPositive ? 'text-[#2ea043]' : 'text-[#da3633]'
                          }`}>
                            {day.day}
                          </div>

                          {/* Resultado do Dia */}
                          <div className={`text-right font-['Orbitron'] text-[9px] sm:text-xs md:text-base font-bold tracking-tight leading-tight ${
                            isPositive ? 'text-[#2ea043]' : 'text-[#da3633]'
                          }`}>
                            {/* Mobile: Formato compacto */}
                            <span className="block sm:hidden">
                              {day.total! >= 0 ? '+' : ''}{Math.round(day.total!)}
                            </span>
                            {/* Desktop: Formato completo */}
                            <span className="hidden sm:block">
                              {formatCurrency(day.total!)}
                            </span>
                          </div>

                          {/* Tooltip com Detalhes por Robô - Apenas Desktop/Tablet */}
                          <div className="hidden sm:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-[#161b22] backdrop-blur-md rounded-xl p-4 shadow-2xl border border-[#30363d] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-20 pointer-events-none">
                            <div className="space-y-2">
                              {AUTOMATION_ROBOTS.map(robot => {
                                const value = dayData.robots[robot] || 0;
                                const logoUrl = ROBOT_LOGOS[robot];
                                
                                return (
                                  <div key={robot} className="flex justify-between items-center gap-3 text-xs border-b border-[#30363d] pb-2 last:border-b-0">
                                    <div className="flex items-center gap-2 flex-1">
                                      {logoUrl && (
                                        <img 
                                          src={logoUrl} 
                                          alt={robot}
                                          className="w-5 h-5 object-contain rounded"
                                        />
                                      )}
                                      <span className="text-[#8b949e] font-['Inter'] text-xs">{robot}</span>
                                    </div>
                                    <span className={`font-['Orbitron'] font-semibold text-xs ${
                                      value >= 0 ? 'text-[#2ea043]' : 'text-[#da3633]'
                                    }`}>
                                      {formatCurrency(value)}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                            {/* Seta do Tooltip */}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#161b22]" />
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}