import { DailyReportData } from './dailyReportParser';

export function exportDailyReportToCSV(reports: DailyReportData[]): void {
  if (reports.length === 0) {
    alert('Nenhum relatório para exportar');
    return;
  }

  // Cabeçalho do CSV
  const headers = [
    'DATA',
    'ROBÔ',
    'OPERAÇÃO',
    'HORA ENTRADA',
    'HORA SAÍDA',
    'PREÇO ENTRADA',
    'PARCIAL',
    'PREÇO SAÍDA',
    'CONTRATOS',
    'RESULTADO'
  ];

  const rows: string[] = [headers.join(';')];

  // Adiciona todas as operações de todos os relatórios
  reports.forEach(report => {
    Object.values(report.robots).forEach(robot => {
      robot.trades.forEach(trade => {
        const row = [
          report.date,
          robot.name,
          trade.operacao,
          trade.horaEntrada,
          trade.horaSaida || '',
          trade.precoEntrada,
          trade.parcial || '',
          trade.precoSaida,
          trade.contratos.toString().replace('.', ','),
          trade.resultado.toString().replace('.', ',')
        ];
        rows.push(row.join(';'));
      });
    });
  });

  // Cria o blob e faz download
  const csvContent = rows.join('\n');
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
  link.setAttribute('href', url);
  link.setAttribute('download', `XTRADERS_Historico_${today}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportSingleReportToCSV(report: DailyReportData): void {
  const headers = [
    'DATA',
    'ROBÔ',
    'OPERAÇÃO',
    'HORA ENTRADA',
    'HORA SAÍDA',
    'PREÇO ENTRADA',
    'PARCIAL',
    'PREÇO SAÍDA',
    'CONTRATOS',
    'RESULTADO'
  ];

  const rows: string[] = [headers.join(';')];

  Object.values(report.robots).forEach(robot => {
    robot.trades.forEach(trade => {
      const row = [
        report.date,
        robot.name,
        trade.operacao,
        trade.horaEntrada,
        trade.horaSaida || '',
        trade.precoEntrada,
        trade.parcial || '',
        trade.precoSaida,
        trade.contratos.toString().replace('.', ','),
        trade.resultado.toString().replace('.', ',')
      ];
      rows.push(row.join(';'));
    });
  });

  const csvContent = rows.join('\n');
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  const dateFormatted = report.date.replace(/\./g, '');
  link.setAttribute('href', url);
  link.setAttribute('download', `XTRADERS_Relatorio_${dateFormatted}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
