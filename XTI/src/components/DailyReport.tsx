import { useState, useEffect } from 'react';
import { Download, Table, Database, Calendar } from 'lucide-react';
import { processDailyReport, DailyReportData, DailyRobotData } from '../utils/dailyReportParser';
import { exportDailyReportToCSV, exportSingleReportToCSV } from '../utils/exportToSpreadsheet';
import { HistoricalSheet } from './HistoricalSheet';
import { WeeklyMonthlyView } from './WeeklyMonthlyView';
import { loadHistoricalData, saveDailyResult, deleteDailyResult, HistoricalData } from '../utils/historicalDataManager';
import { importBulkData } from '../utils/bulkImporter';
import { LoadingScreen } from './LoadingScreen';

const ROBOTS_WITH_PARTIALS = ['ATRION WIN', 'ORION WIN'];

export function DailyReport() {
  const [reportData, setReportData] = useState<DailyReportData | null>(null);
  const [allReports, setAllReports] = useState<DailyReportData[]>([]);
  const [historicalData, setHistoricalData] = useState<HistoricalData>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('xtraders_daily_reports');
    if (saved) {
      try {
        setAllReports(JSON.parse(saved));
      } catch (e) {
        console.error('Erro ao carregar relatórios salvos:', e);
      }
    }

    const historical = loadHistoricalData();
    setHistoricalData(historical);
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      console.log('🚀 UPLOAD INICIADO');
      const data = await processDailyReport(file);
      console.log('📄 Relatório processado:', data);
      console.log('📅 Data extraída:', data.date);
      
      setReportData(data);
      
      const updatedReports = [data, ...allReports];
      setAllReports(updatedReports);
      localStorage.setItem('xtraders_daily_reports', JSON.stringify(updatedReports));

      console.log('🔄 Chamando saveDailyResult...');
      // Salva automaticamente no histórico - aparece no calendário
      const updatedHistorical = saveDailyResult(data);
      console.log('💾 Histórico retornado de saveDailyResult:', updatedHistorical);
      console.log('🗓️ Chaves de datas salvas:', Object.keys(updatedHistorical));
      
      console.log('🔄 Chamando setHistoricalData...');
      setHistoricalData(updatedHistorical);
      console.log('✅ setHistoricalData chamado!');

      // Confirmação visual
      alert(`✅ Relatório do dia ${data.date.split('.').reverse().join('/')} salvo com sucesso!\n\nResultado: ${formatCurrency(data.totalAutomation)}\n\nJá aparece no calendário mensal! 📅`);
    } catch (error) {
      alert(`Erro ao processar arquivo: ${error}`);
      console.error(error);
    }

    event.target.value = '';
  };

  const handleDeleteHistoricalRecord = (dateKey: string) => {
    const updatedHistorical = deleteDailyResult(dateKey);
    setHistoricalData(updatedHistorical);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '--/--/----';
    return dateStr.split('.').reverse().join('/');
  };

  // Loading Screen
  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />;
  }

  // Estado Inicial - Apenas Planilha Histórica + Upload Centralizado
  if (!reportData) {
    return (
      <div className="min-h-screen bg-[#0d1117] p-8">
        <div className="w-full max-w-[1400px] mx-auto space-y-8">
          {/* Logo Central */}
          <div className="flex justify-center mb-8">
            <img 
              src="https://i.ibb.co/jswt9pR/LOGO-XTRADERS-Intelligence-1-1.png" 
              alt="XTRADERS Intelligence Logo"
              className="w-48 h-auto"
            />
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <label className="bg-gradient-to-r from-[#00c7ff] to-[#2ea043] text-[#010409] px-8 py-4 rounded-lg font-['Orbitron'] font-bold cursor-pointer transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(46,160,67,0.4)] text-lg">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              Carregar Relatório do Dia
            </label>

            <button
              onClick={() => {
                importBulkData();
                setTimeout(() => {
                  const updated = loadHistoricalData();
                  setHistoricalData(updated);
                }, 500);
              }}
              className="flex items-center gap-2 bg-[#161b22] border-2 border-[#58a6ff] text-[#58a6ff] px-8 py-4 rounded-lg font-['Orbitron'] font-bold cursor-pointer transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(88,166,255,0.4)] text-lg"
            >
              <Database className="w-5 h-5" />
              Importar Dados 2025
            </button>
          </div>

          {/* Análise Semanal/Mensal */}
          {Object.keys(historicalData).length > 0 && (
            <div className="mb-8">
              <div className="mb-6 text-center">
                <h2 className="font-['Orbitron'] text-3xl text-[#c9d1d9] mb-2">
                  Calendário de Resultados
                </h2>
                <p className="text-[#8b949e] font-['Inter']">
                  Visualização detalhada por mês e semana
                </p>
              </div>
              <WeeklyMonthlyView historicalData={historicalData} />
            </div>
          )}

          {/* Planilha Histórica */}
          <HistoricalSheet 
            historicalData={historicalData}
            onDelete={handleDeleteHistoricalRecord}
          />
        </div>
      </div>
    );
  }

  // Estado com Relatório Carregado - Sidebar + Cards + Planilha
  const sortedRobots = Object.values(reportData.robots).sort((a, b) => {
    if (a.name === 'OPERAÇÕES NA MÃO') return 1;
    if (b.name === 'OPERAÇÕES NA MÃO') return -1;
    return 0;
  });

  const automationRobots = sortedRobots.filter(r => r.name !== 'OPERAÇÕES NA MÃO');
  const manualRobot = sortedRobots.find(r => r.name === 'OPERAÇÕES NA MÃO');

  return (
    <div className="min-h-screen bg-[#0d1117] p-8">
      <div className="max-w-[1400px] mx-auto flex gap-10">
        {/* Sidebar */}
        <aside className="w-[300px] flex-shrink-0 sticky top-8 h-fit space-y-8">
          <div className="flex justify-center">
            <img 
              src="https://i.ibb.co/jswt9pR/LOGO-XTRADERS-Intelligence-1-1.png" 
              alt="XTRADERS Intelligence Logo"
              className="w-36 h-auto"
            />
          </div>

          {/* Report Summary */}
          <div className={`bg-[#161b22] rounded-xl border-2 p-8 text-center transition-all ${
            reportData.totalAutomation > 0 ? 'border-[#2ea043]' : 
            reportData.totalAutomation < 0 ? 'border-[#da3633]' : 'border-[#30363d]'
          }`}>
            <h2 className="font-['Orbitron'] text-2xl text-[#c9d1d9] mb-3">RELATÓRIO</h2>
            <p className="text-xl font-medium mb-6 text-[#8b949e]">{formatDate(reportData.date)}</p>
            <div className={`border-2 rounded-xl p-4 ${
              reportData.totalAutomation > 0 ? 'border-[#2ea043]' : 
              reportData.totalAutomation < 0 ? 'border-[#da3633]' : 'border-[#30363d]'
            }`}>
              <div className="text-sm text-[#8b949e] mb-1">Resultado Automações:</div>
              <div className={`text-2xl font-bold ${
                reportData.totalAutomation > 0 ? 'text-[#2ea043]' : 
                reportData.totalAutomation < 0 ? 'text-[#da3633]' : 'text-[#c9d1d9]'
              }`}>
                {formatCurrency(reportData.totalAutomation)}
              </div>
            </div>
          </div>

          {/* Upload Button */}
          <div className="flex justify-center">
            <label className="bg-gradient-to-r from-[#00c7ff] to-[#2ea043] text-[#010409] px-6 py-3 rounded-lg font-bold cursor-pointer transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(46,160,67,0.4)]">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              Carregar Novo
            </label>
          </div>

          {/* Export Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => exportSingleReportToCSV(reportData)}
              className="w-full flex items-center justify-center gap-2 bg-[#161b22] border border-[#30363d] text-[#c9d1d9] px-4 py-2.5 rounded-lg font-medium hover:border-[#58a6ff] hover:text-[#58a6ff] transition-all"
            >
              <Download className="w-4 h-4" />
              Exportar Relatório
            </button>
            
            {allReports.length > 1 && (
              <button
                onClick={() => exportDailyReportToCSV(allReports)}
                className="w-full flex items-center justify-center gap-2 bg-[#161b22] border border-[#30363d] text-[#c9d1d9] px-4 py-2.5 rounded-lg font-medium hover:border-[#2ea043] hover:text-[#2ea043] transition-all"
              >
                <Table className="w-4 h-4" />
                Exportar Histórico ({allReports.length})
              </button>
            )}
          </div>

          {/* Back Button */}
          <button
            onClick={() => setReportData(null)}
            className="w-full text-[#8b949e] hover:text-[#c9d1d9] text-sm transition-colors font-['Inter']"
          >
            ← Voltar à planilha
          </button>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* Grid de Robôs de Automação */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {automationRobots.map((robot, idx) => (
              <RobotCard key={robot.name} robot={robot} delay={idx * 100} />
            ))}
          </div>

          {/* Operações Manuais */}
          {manualRobot && manualRobot.trades.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-['Orbitron'] text-2xl text-[#8b949e] pb-3 border-b border-[#30363d]">
                Operações na Mão
              </h2>
              <div className="max-w-md">
                <RobotCard robot={manualRobot} delay={0} />
              </div>
            </div>
          )}

          {/* Calendário de Resultados */}
          {Object.keys(historicalData).length > 0 && (
            <div className="pt-8">
              <div className="mb-6">
                <h2 className="font-['Orbitron'] text-3xl text-[#c9d1d9] mb-2">
                  📅 Calendário de Resultados
                </h2>
                <p className="text-[#8b949e] font-['Inter']">
                  Visualização detalhada por mês e semana - O dia {formatDate(reportData.date)} já está salvo!
                </p>
              </div>
              <WeeklyMonthlyView historicalData={historicalData} />
            </div>
          )}

          {/* Planilha Histórica */}
          <div className="pt-8">
            <HistoricalSheet 
              historicalData={historicalData}
              onDelete={handleDeleteHistoricalRecord}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface RobotCardProps {
  robot: DailyRobotData;
  delay: number;
}

function RobotCard({ robot, delay }: RobotCardProps) {
  const totalResult = robot.trades.reduce((sum, trade) => sum + trade.resultado, 0);
  
  const cardState = robot.trades.length === 0 ? 'neutral' : 
    totalResult > 0 ? 'positive' : totalResult < 0 ? 'negative' : 'neutral';
  
  const dotState = robot.trades.length === 0 ? 'grey' :
    totalResult > 0 ? 'green' : totalResult < 0 ? 'red' : 'grey';

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div
      className={`bg-[#161b22] rounded-xl border-2 p-5 flex flex-col transition-all hover:translate-y-[-5px] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] ${
        cardState === 'positive' ? 'border-[#2ea043] hover:shadow-[0_0_25px_rgba(46,160,67,0.4)]' :
        cardState === 'negative' ? 'border-[#da3633]' : 'border-[#30363d]'
      }`}
      style={{ 
        animation: 'fadeInUp 0.5s ease forwards',
        animationDelay: `${delay}ms`,
        opacity: 0
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-[#30363d]">
        <span className={`w-5 h-5 rounded-full flex-shrink-0 ${
          dotState === 'green' ? 'bg-[#2ea043]' :
          dotState === 'red' ? 'bg-[#da3633]' : 'bg-[#8b949e]'
        }`} />
        
        <div className="flex-1">
          <h3 className="font-['Orbitron'] text-xl font-semibold text-[#c9d1d9]">{robot.name}</h3>
          <p className="text-xs text-[#8b949e]">{robot.margem}</p>
        </div>

        {robot.logoUrl && (
          <img 
            src={robot.logoUrl} 
            alt={`${robot.name} Logo`}
            className="w-10 h-10 object-contain"
          />
        )}
      </div>

      {/* Body - Trades Table */}
      <div className="flex-1 py-3">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[#8b949e] font-medium">
              <th className="text-left pb-2"></th>
              <th className="text-left pb-2">Entrada</th>
              <th className="text-left pb-2">Parcial</th>
              <th className="text-left pb-2">Saída</th>
              <th className="text-left pb-2">Resultado</th>
            </tr>
          </thead>
          <tbody>
            {robot.trades.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-[#8b949e] py-8">
                  Nenhuma operação no dia
                </td>
              </tr>
            ) : (
              robot.trades.map((trade, idx) => {
                const opType = trade.operacao?.toUpperCase() === 'COMPRA' ? 'C' : 'V';
                const resultClass = trade.resultado >= 0 ? 'text-[#2ea043]' : 'text-[#da3633]';
                
                return (
                  <tr key={idx} className="border-t border-[#21262d]">
                    <td className={`py-2 font-medium ${
                      opType === 'C' ? 'text-[#2ea043]' : 'text-[#da3633]'
                    }`}>
                      {opType}
                    </td>
                    <td className="py-2 text-[#c9d1d9]">{trade.precoEntrada}</td>
                    <td className="py-2 text-[#c9d1d9]">
                      {ROBOTS_WITH_PARTIALS.includes(robot.name) ? (trade.parcial || '-') : '-'}
                    </td>
                    <td className="py-2 text-[#c9d1d9]">{trade.precoSaida}</td>
                    <td className={`py-2 font-medium ${resultClass}`}>
                      {formatCurrency(trade.resultado)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-4 border-t border-[#30363d] text-sm font-medium">
        <span className="text-[#8b949e]">QTD. OP: {robot.trades.length}</span>
        <span className={
          cardState === 'positive' ? 'text-[#2ea043]' :
          cardState === 'negative' ? 'text-[#da3633]' : 'text-[#c9d1d9]'
        }>
          {formatCurrency(totalResult)}
        </span>
      </div>
    </div>
  );
}