export interface Trade {
  // Campos básicos (mantidos para compatibilidade)
  date: string;
  year: string;
  month: string;
  value: number;
  robot: string;
  weekday: number;
  sourceFile: string;
  
  // Campos detalhados para a tabela
  ticket: string;
  positionId?: string;
  openTime: string;
  closeTime?: string;
  symbol: string;
  type: 'buy' | 'sell';
  volume: number;
  openPrice: number;
  closePrice: number;
  profit: number;
  swap: number;
  commission: number;
  magic?: string;
  comment?: string;
}

const MAGIC_MAP: { [key: string]: string } = {
  '175939': 'ATRION WIN',
  '135791': 'ORION WIN',
  '303030': 'CRONOS WDO',
  '404040': 'ZARION'
};

export async function processFiles(files: FileList): Promise<Trade[]> {
  const promises = Array.from(files).map(file => {
    return new Promise<{ text: string; name: string }>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({ 
          text: e.target?.result as string, 
          name: file.name 
        });
      };
      reader.readAsText(file, 'ISO-8859-1');
    });
  });

  const results = await Promise.all(promises);
  const allTrades: Trade[] = [];

  results.forEach(({ text, name }) => {
    const trades = parseFile(text, name);
    allTrades.push(...trades);
  });

  return allTrades.sort((a, b) => a.openTime.localeCompare(b.openTime));
}

function parseFile(text: string, filename: string): Trade[] {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];

  const header = lines[0];

  if (header.includes('<DATE>') && header.includes('<BALANCE>')) {
    return parseMT5Graph(lines, filename);
  }
  else if (header.includes('Ticket') && (header.includes('Data') || header.includes('Time'))) {
    return parseMT5Report(lines, filename);
  }
  else {
    return parseSpreadsheet(lines, filename);
  }
}

function parseMT5Graph(lines: string[], filename: string): Trade[] {
  const trades: Trade[] = [];
  const robotName = filename.replace('.csv', '').split(' l')[0].trim();
  const delimiter = lines[0].includes('\t') ? '\t' : ';';
  const headers = lines[0].split(delimiter);
  
  const dateIdx = headers.findIndex(h => h.includes('<DATE>'));
  const balIdx = headers.findIndex(h => h.includes('<BALANCE>'));

  if (dateIdx === -1 || balIdx === -1) return [];

  let prevBalance: number | null = null;
  let ticketCounter = 1;

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(delimiter);
    if (cols.length < 2) continue;

    const balance = parseFloat(cols[balIdx].replace(',', '.'));
    if (isNaN(balance)) continue;

    if (prevBalance === null) {
      prevBalance = balance;
      continue;
    }

    const profit = balance - prevBalance;
    prevBalance = balance;

    const dateRaw = cols[dateIdx].trim();
    const date = dateRaw.split(' ')[0].replace(/\./g, '-');

    const trade = createTradeFromGraph(date, profit, robotName, filename, `GRAPH-${ticketCounter++}`);
    if (trade) trades.push(trade);
  }

  return trades;
}

function parseMT5Report(lines: string[], filename: string): Trade[] {
  const trades: Trade[] = [];
  const delimiter = lines[0].includes(';') ? ';' : ',';
  const headers = lines[0].split(delimiter);

  const ticketIdx = headers.findIndex(h => h.toLowerCase().includes('ticket'));
  const posIdIdx = headers.findIndex(h => h.toLowerCase().includes('position') || h.toLowerCase().includes('posição'));
  const timeIdx = headers.findIndex(h => h.includes('Data') || h.includes('Time'));
  const symbolIdx = headers.findIndex(h => h.toLowerCase().includes('symbol') || h.toLowerCase().includes('símbolo'));
  const typeIdx = headers.findIndex(h => h.toLowerCase().includes('type') || h.toLowerCase().includes('tipo'));
  const volumeIdx = headers.findIndex(h => h.toLowerCase().includes('volume'));
  const priceIdx = headers.findIndex(h => h.toLowerCase().includes('price') || h.toLowerCase().includes('preço'));
  const profitIdx = headers.findIndex(h => h.includes('Lucro') || h.includes('Profit'));
  const swapIdx = headers.findIndex(h => h.includes('Swap'));
  const commIdx = headers.findIndex(h => h.includes('Comiss') || h.includes('Comm'));
  const magicIdx = headers.findIndex(h => h.includes('Magic') || h.includes('ID'));
  const commentIdx = headers.findIndex(h => h.toLowerCase().includes('comment') || h.toLowerCase().includes('comentário'));

  if (timeIdx === -1 || profitIdx === -1) return [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(delimiter);
    if (cols.length < 2) continue;

    const getValue = (idx: number) => {
      if (idx === -1) return 0;
      return parseFloat((cols[idx] || '0').replace(',', '.')) || 0;
    };

    const getString = (idx: number, defaultValue = '') => {
      if (idx === -1) return defaultValue;
      return cols[idx]?.trim() || defaultValue;
    };

    const profit = getValue(profitIdx);
    const swap = getValue(swapIdx);
    const commission = getValue(commIdx);
    const totalProfit = profit + swap + commission;
    
    const dateRaw = cols[timeIdx];
    if (!dateRaw) continue;

    const magic = getString(magicIdx, '0');
    if (magic === '1247' || magic === '0') continue;

    const robotName = MAGIC_MAP[magic] || `ID: ${magic}`;
    
    const ticket = getString(ticketIdx, `T${i}`);
    const positionId = getString(posIdIdx);
    const symbol = getString(symbolIdx, 'UNKNOWN');
    const typeStr = getString(typeIdx, 'buy').toLowerCase();
    const type: 'buy' | 'sell' = typeStr.includes('sell') || typeStr.includes('venda') ? 'sell' : 'buy';
    const volume = getValue(volumeIdx);
    const price = getValue(priceIdx);
    const comment = getString(commentIdx);

    const trade = createTradeFromReport(
      dateRaw, totalProfit, robotName, filename, ticket, positionId,
      symbol, type, volume, price, price, profit, swap, commission, magic, comment
    );
    
    if (trade) trades.push(trade);
  }

  return trades;
}

function parseSpreadsheet(lines: string[], filename: string): Trade[] {
  const trades: Trade[] = [];
  const headers = lines[0].split(';');
  const robots: { [key: number]: string } = {};

  for (let i = 1; i < headers.length; i++) {
    const name = headers[i].trim();
    if (name && !name.toUpperCase().includes('RESULTADO') && !name.toUpperCase().includes('TOTAL')) {
      robots[i] = name;
    }
  }

  const monthMap: { [key: string]: string } = {
    'jan': '01', 'fev': '02', 'mar': '03', 'abr': '04',
    'mai': '05', 'jun': '06', 'jul': '07', 'ago': '08',
    'set': '09', 'out': '10', 'nov': '11', 'dez': '12'
  };

  const year = '2025';
  let ticketCounter = 1;

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(';');
    if (cols.length < 2) continue;

    const dateRaw = cols[0].trim().toLowerCase();
    if (!dateRaw.includes('/')) continue;

    const [day, monthName] = dateRaw.split('/');
    if (!monthMap[monthName]) continue;

    const date = `${year}-${monthMap[monthName]}-${day.padStart(2, '0')}`;

    for (const colIdx in robots) {
      if (cols[colIdx]) {
        const valueStr = cols[colIdx]
          .replace('R$', '')
          .replace(/\s/g, '')
          .replace(/\./g, '')
          .replace(',', '.')
          .trim();

        if (valueStr && valueStr !== '-') {
          const value = parseFloat(valueStr);
          if (!isNaN(value)) {
            const trade = createTradeFromGraph(
              date, value, robots[colIdx], filename, `SHEET-${ticketCounter++}`
            );
            if (trade) trades.push(trade);
          }
        }
      }
    }
  }

  return trades;
}

function createTradeFromGraph(
  date: string, 
  value: number, 
  robot: string, 
  sourceFile: string,
  ticket: string
): Trade | null {
  if (value === 0) return null;

  const dateObj = new Date(date + 'T12:00:00');
  const openTime = date + 'T09:00:00';
  
  return {
    date,
    year: date.substring(0, 4),
    month: date.substring(0, 7),
    value,
    robot,
    weekday: dateObj.getDay(),
    sourceFile,
    ticket,
    openTime,
    symbol: 'CONSOLIDATED',
    type: value >= 0 ? 'buy' : 'sell',
    volume: 1,
    openPrice: 0,
    closePrice: 0,
    profit: value,
    swap: 0,
    commission: 0,
    comment: 'Consolidado do gráfico de saldo'
  };
}

function createTradeFromReport(
  dateRaw: string,
  profit: number,
  robot: string,
  sourceFile: string,
  ticket: string,
  positionId: string,
  symbol: string,
  type: 'buy' | 'sell',
  volume: number,
  openPrice: number,
  closePrice: number,
  profitRaw: number,
  swap: number,
  commission: number,
  magic: string,
  comment: string
): Trade | null {
  if (profit === 0) return null;

  const date = dateRaw.split(' ')[0].replace(/\./g, '-');
  const dateObj = new Date(date + 'T12:00:00');
  
  return {
    date,
    year: date.substring(0, 4),
    month: date.substring(0, 7),
    value: profit,
    robot,
    weekday: dateObj.getDay(),
    sourceFile,
    ticket,
    positionId,
    openTime: dateRaw.replace(/\./g, '-').replace(' ', 'T'),
    symbol,
    type,
    volume,
    openPrice,
    closePrice,
    profit,
    swap,
    commission,
    magic,
    comment
  };
}
