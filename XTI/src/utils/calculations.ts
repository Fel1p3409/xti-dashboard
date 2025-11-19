import { Trade } from './fileParser';

export interface RobotStats {
  name: string;
  totalProfit: number;
  totalTrades: number;
  wins: number;
  losses: number;
  winRate: number;
}

export interface MetricsData {
  netProfit: number;
  profitFactor: number;
  maxDrawdown: number;
  sqn: number;
  avgTrade: number;
  payoff: number;
  winRate: number;
  bestRobot: { name: string; value: number };
  worstRobot: { name: string; value: number };
  bestMonth: { name: string; value: number };
  equityData: { date: string; equity: number; drawdown: number }[];
  heatmapData: { [year: string]: number[] };
  weekdayData: number[];
  robotStats: RobotStats[];
}

export function calculateMetrics(filteredTrades: Trade[], allTrades: Trade[], robotFilter: string): MetricsData {
  let netProfit = 0;
  let grossWin = 0;
  let grossLoss = 0;
  let wins = 0;
  let losses = 0;
  const tradeValues: number[] = [];
  const dailyProfits: { [date: string]: number } = {};
  const robotData: { [name: string]: { profit: number; trades: number; wins: number; losses: number } } = {};
  const weekdayData = [0, 0, 0, 0, 0, 0, 0];
  const monthAgg: { [month: string]: number } = {};

  filteredTrades.forEach(trade => {
    netProfit += trade.value;
    tradeValues.push(trade.value);

    if (trade.value > 0) {
      grossWin += trade.value;
      wins++;
    } else {
      grossLoss += Math.abs(trade.value);
      losses++;
    }

    dailyProfits[trade.date] = (dailyProfits[trade.date] || 0) + trade.value;

    if (!robotData[trade.robot]) {
      robotData[trade.robot] = { profit: 0, trades: 0, wins: 0, losses: 0 };
    }
    const rb = robotData[trade.robot];
    rb.profit += trade.value;
    rb.trades++;
    if (trade.value > 0) rb.wins++;
    else rb.losses++;

    weekdayData[trade.weekday] += trade.value;

    monthAgg[trade.month] = (monthAgg[trade.month] || 0) + trade.value;
  });

  const totalTrades = wins + losses;
  const profitFactor = grossLoss > 0 ? grossWin / grossLoss : (grossWin > 0 ? 99 : 0);
  const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
  const avgTrade = totalTrades > 0 ? netProfit / totalTrades : 0;
  const stdDev = calculateStdDev(tradeValues);
  const sqn = stdDev > 0 && totalTrades > 0 ? (avgTrade / stdDev) * Math.sqrt(totalTrades) : 0;
  const avgWin = wins > 0 ? grossWin / wins : 0;
  const avgLoss = losses > 0 ? grossLoss / losses : 0;
  const payoff = avgLoss > 0 ? avgWin / avgLoss : (avgWin > 0 ? 99 : 0);

  const equityData: { date: string; equity: number; drawdown: number }[] = [];
  let balance = 0;
  let peak = 0;
  let maxDrawdown = 0;

  const sortedDates = Object.keys(dailyProfits).sort();
  
  sortedDates.forEach(date => {
    balance += dailyProfits[date];
    if (balance > peak) peak = balance;
    const dd = balance - peak;
    if (dd < maxDrawdown) maxDrawdown = dd;

    const [year, month, day] = date.split('-');
    equityData.push({
      date: `${day}/${month}`,
      equity: balance,
      drawdown: dd
    });
  });

  let bestRobot = { name: '-', value: -Infinity };
  let worstRobot = { name: '-', value: Infinity };

  Object.entries(robotData).forEach(([name, data]) => {
    if (data.profit > bestRobot.value) {
      bestRobot = { name, value: data.profit };
    }
    if (data.profit < worstRobot.value) {
      worstRobot = { name, value: data.profit };
    }
  });

  let bestMonth = { name: '-', value: -Infinity };
  Object.entries(monthAgg).forEach(([month, value]) => {
    if (value > bestMonth.value) {
      const [year, m] = month.split('-');
      bestMonth = { name: `${m}/${year}`, value };
    }
  });

  const robotStats: RobotStats[] = Object.entries(robotData)
    .map(([name, data]) => ({
      name,
      totalProfit: data.profit,
      totalTrades: data.trades,
      wins: data.wins,
      losses: data.losses,
      winRate: data.trades > 0 ? (data.wins / data.trades) * 100 : 0
    }))
    .sort((a, b) => b.totalProfit - a.totalProfit);

  const heatmapData: { [year: string]: number[] } = {};
  allTrades.forEach(trade => {
    if (robotFilter !== 'all' && trade.robot !== robotFilter) return;
    
    if (!heatmapData[trade.year]) {
      heatmapData[trade.year] = Array(12).fill(0);
    }
    const monthIdx = parseInt(trade.month.split('-')[1]) - 1;
    heatmapData[trade.year][monthIdx] += trade.value;
  });

  return {
    netProfit,
    profitFactor,
    maxDrawdown,
    sqn,
    avgTrade,
    payoff,
    winRate,
    bestRobot,
    worstRobot,
    bestMonth,
    equityData,
    heatmapData,
    weekdayData,
    robotStats
  };
}

function calculateStdDev(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
}
