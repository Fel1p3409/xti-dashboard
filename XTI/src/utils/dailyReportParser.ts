export interface DailyTrade {
  robotName: string;
  operacao: string;
  horaEntrada: string;
  horaSaida: string;
  precoEntrada: string;
  precoSaida: string;
  parcial?: string;
  contratos: number;
  resultado: number;
}

export interface DailyRobotData {
  name: string;
  margem: string;
  logoUrl: string | null;
  trades: DailyTrade[];
}

export interface DailyReportData {
  date: string;
  robots: { [key: string]: DailyRobotData };
  totalAutomation: number;
}

export interface HistoricalDayData {
  totalDia: number;
  robots: { [robotName: string]: number };
}

export interface HistoricalData {
  [dateKey: string]: HistoricalDayData;
}

const ALL_ROBOTS = [
  { name: 'ATRION WIN', margem: 'Margem 50k: 5 contratos WDO', logoUrl: 'https://i.ibb.co/Gfn4rkTx/ATRION-WIN.png' },
  { name: 'ATRION WDO', margem: 'Margem 50k: 10 contratos WIN', logoUrl: 'https://i.ibb.co/Gfn4rkTx/ATRION-WIN.png' },
  { name: 'CRONOS WDO', margem: 'Margem 50k: 5 contratos WDO', logoUrl: 'https://i.ibb.co/ynrKMFFj/CRONOS.png' },
  { name: 'ORION WIN', margem: 'Margem 50k: 10 contratos WIN', logoUrl: 'https://i.ibb.co/GgN9Q1h/ORION.png' },
  { name: 'ZARION', margem: 'Margem 50k: 10 contratos WIN', logoUrl: 'https://i.ibb.co/MD7sk6Tm/ZARION.png' },
  { name: 'GIRION', margem: 'N/A', logoUrl: '' },
  { name: 'OPERAÇÕES NA MÃO', margem: 'Manual', logoUrl: null }
];

export const AUTOMATION_ROBOTS = ALL_ROBOTS.filter(r => r.name !== 'OPERAÇÕES NA MÃO').map(r => r.name);

const ROBOTS_WITH_PARTIALS = ['ATRION WIN', 'ORION WIN'];

// Converte data de qualquer formato para DD.MM.AAAA
function normalizeDate(dateStr: string): string {
  if (!dateStr) return '';
  
  // Remove espaços
  dateStr = dateStr.trim();
  
  // Detecta o formato e converte para DD.MM.AAAA
  // Formato AAAA.MM.DD ou AAAA-MM-DD ou AAAA/MM/DD
  if (/^\d{4}[.\-\/]\d{1,2}[.\-\/]\d{1,2}$/.test(dateStr)) {
    const parts = dateStr.split(/[.\-\/]/);
    const year = parts[0];
    const month = parts[1].padStart(2, '0');
    const day = parts[2].padStart(2, '0');
    return `${day}.${month}.${year}`;
  }
  
  // Formato DD.MM.AAAA ou DD-MM-AAAA ou DD/MM/AAAA (já correto, só normaliza separador)
  if (/^\d{1,2}[.\-\/]\d{1,2}[.\-\/]\d{4}$/.test(dateStr)) {
    const parts = dateStr.split(/[.\-\/]/);
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];
    return `${day}.${month}.${year}`;
  }
  
  console.warn('⚠️ Formato de data não reconhecido:', dateStr);
  return dateStr;
}

export async function processDailyReport(file: File): Promise<DailyReportData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        const result = parseDailyCSV(csvText);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsText(file, 'windows-1252');
  });
}

function parseDailyCSV(csvText: string): DailyReportData {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('Arquivo CSV inválido ou vazio.');
  }

  const headers = lines.shift()!.split(';').map(h => h.trim());
  const colIndices: { [key: string]: number } = {};
  headers.forEach((h, i) => { colIndices[h] = i; });

  const robotNameKey = Object.keys(colIndices).find(
    k => k.toUpperCase().includes('ROBO') || k.toUpperCase().includes('ROBÔ')
  );
  
  if (!robotNameKey) {
    throw new Error('Coluna "ROBÔ" ou "ROBO" não encontrada no arquivo.');
  }

  let rawTrades: DailyTrade[] = [];
  let reportDate = '';

  lines.forEach(line => {
    if (line.trim() === '') return;
    const values = line.split(';');

    if (!reportDate && values[colIndices['DATA']]) {
      const rawDate = values[colIndices['DATA']];
      reportDate = normalizeDate(rawDate);
      console.log(`📅 Data original: "${rawDate}" → Data normalizada: "${reportDate}"`);
    }

    const robotName = values[colIndices[robotNameKey]]?.trim();

    if (robotName) {
      rawTrades.push({
        robotName: robotName,
        operacao: values[colIndices['OPERAÇÃO']] || '',
        horaEntrada: values[colIndices['HORA ENTRADA']] || '',
        horaSaida: values[colIndices['HORA SAÍDA']] || '',
        precoEntrada: values[colIndices['PREÇO ENTRADA']] || '',
        precoSaida: values[colIndices['PREÇO SAÍDA']] || '',
        contratos: parseFloat(values[colIndices['CONTRATOS']]?.replace(',', '.') || '0'),
        resultado: parseFloat(values[colIndices['RESULTADO']]?.replace(',', '.') || '0'),
      });
    }
  });

  const processedTrades = groupTradesWithPartials(rawTrades);

  let reportData: { [key: string]: DailyRobotData } = {};
  ALL_ROBOTS.forEach(robot => {
    reportData[robot.name] = { ...robot, trades: [] };
  });

  processedTrades.forEach(trade => {
    if (reportData[trade.robotName]) {
      reportData[trade.robotName].trades.push(trade);
    } else {
      reportData[trade.robotName] = {
        name: trade.robotName,
        margem: 'N/A',
        logoUrl: null,
        trades: [trade]
      };
    }
  });

  let totalAutomation = 0;
  Object.values(reportData).forEach(robot => {
    if (robot.name !== 'OPERAÇÕES NA MÃO') {
      robot.trades.forEach(trade => {
        totalAutomation += trade.resultado;
      });
    }
  });

  return {
    date: reportDate,
    robots: reportData,
    totalAutomation
  };
}

function groupTradesWithPartials(rawTrades: DailyTrade[]): DailyTrade[] {
  const finalTrades: DailyTrade[] = [];
  const tradeGroups: { [key: string]: DailyTrade[] } = {};

  rawTrades.forEach(trade => {
    if (ROBOTS_WITH_PARTIALS.includes(trade.robotName)) {
      const key = `${trade.robotName}_${trade.horaEntrada}`;
      if (!tradeGroups[key]) {
        tradeGroups[key] = [];
      }
      tradeGroups[key].push(trade);
    } else {
      finalTrades.push(trade);
    }
  });

  for (const key in tradeGroups) {
    const group = tradeGroups[key];
    group.sort((a, b) => a.horaSaida.localeCompare(b.horaSaida));

    if (group.length === 1) {
      finalTrades.push(group[0]);
    } else {
      const firstTrade = group[0];
      const lastTrade = group[group.length - 1];

      finalTrades.push({
        robotName: firstTrade.robotName,
        operacao: firstTrade.operacao,
        horaEntrada: firstTrade.horaEntrada,
        horaSaida: lastTrade.horaSaida,
        precoEntrada: firstTrade.precoEntrada,
        parcial: `${firstTrade.precoSaida}(${firstTrade.contratos})`,
        precoSaida: `${lastTrade.precoSaida}(${lastTrade.contratos})`,
        contratos: group.reduce((sum, t) => sum + t.contratos, 0),
        resultado: group.reduce((sum, t) => sum + t.resultado, 0)
      });
    }
  }
  
  return finalTrades;
}