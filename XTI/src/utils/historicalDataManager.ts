import { HistoricalData, HistoricalDayData, DailyReportData, AUTOMATION_ROBOTS } from './dailyReportParser';

const HISTORICAL_STORAGE_KEY = 'xtraders_historical_results';

export function loadHistoricalData(): HistoricalData {
  try {
    const storedData = localStorage.getItem(HISTORICAL_STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : {};
  } catch (e) {
    console.error('Erro ao carregar dados históricos:', e);
    return {};
  }
}

export function saveHistoricalData(data: HistoricalData): void {
  try {
    localStorage.setItem(HISTORICAL_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Erro ao salvar dados históricos:', e);
  }
}

export function saveDailyResult(reportData: DailyReportData): HistoricalData {
  console.log('🔍 saveDailyResult - INÍCIO');
  console.log('📥 reportData recebido:', reportData);
  console.log('📅 reportData.date:', reportData.date);
  
  if (!reportData.date) {
    console.log('❌ ERRO: reportData.date está vazio!');
    return loadHistoricalData();
  }

  // Converte DD.MM.AAAA ou DD/MM/AAAA para formato de chave DD.MM.AAAA
  const dateKey = reportData.date.replace(/\//g, '.');
  console.log('🔑 dateKey gerado:', dateKey);

  let historicalData = loadHistoricalData();
  console.log('📂 historicalData carregado:', historicalData);

  // Prepara a estrutura de dados para o dia
  let dailyResults: HistoricalDayData = {
    totalDia: reportData.totalAutomation,
    robots: {}
  };
  console.log('💰 totalDia:', reportData.totalAutomation);

  // Extrai o resultado de cada robô de automação para o dia
  AUTOMATION_ROBOTS.forEach(robotName => {
    const robotData = reportData.robots[robotName];
    console.log(`🤖 Processando ${robotName}:`, robotData);
    
    const result = robotData?.trades?.reduce((sum, trade) => sum + trade.resultado, 0) || 0;
    dailyResults.robots[robotName] = result;
    console.log(`   ✅ ${robotName} total: ${result}`);
  });

  console.log('📊 dailyResults completo:', dailyResults);

  // Salva o resultado do dia, sobrescrevendo se a data já existir
  historicalData[dateKey] = dailyResults;
  console.log('💾 historicalData ANTES de salvar:', historicalData);
  
  saveHistoricalData(historicalData);
  
  console.log('✅ saveDailyResult - FIM');
  console.log('🗓️ Chaves salvas:', Object.keys(historicalData));
  
  return historicalData;
}

export function deleteDailyResult(dateKey: string): HistoricalData {
  let historicalData = loadHistoricalData();
  delete historicalData[dateKey];
  saveHistoricalData(historicalData);
  return historicalData;
}

export function getSortedDates(historicalData: HistoricalData): string[] {
  return Object.keys(historicalData).sort((a, b) => {
    // Converte DD.MM.AAAA para AAAA-MM-DD para comparação
    const dateA = a.split('.').reverse().join('-');
    const dateB = b.split('.').reverse().join('-');
    return dateA.localeCompare(dateB);
  });
}

export function calculateCumulativeTotal(historicalData: HistoricalData, upToDate?: string): number {
  const sortedDates = getSortedDates(historicalData);
  let cumulative = 0;
  
  for (const date of sortedDates) {
    cumulative += historicalData[date].totalDia;
    if (upToDate && date === upToDate) break;
  }
  
  return cumulative;
}