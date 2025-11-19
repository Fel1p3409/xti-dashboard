import { useState, useEffect } from 'react';
import { BarChart3, FileText } from 'lucide-react';
import { Header } from './components/Header';
import { FileList } from './components/FileList';
import { Highlights } from './components/Highlights';
import { Metrics } from './components/Metrics';
import { EquityChart } from './components/EquityChart';
import { HeatMap } from './components/HeatMap';
import { WeekdayChart } from './components/WeekdayChart';
import { RobotDistChart } from './components/RobotDistChart';
import { RobotCards } from './components/RobotCards';
import { TradesTable } from './components/TradesTable';
import { InitialScreen } from './components/InitialScreen';
import { DailyReport } from './components/DailyReport';
import { processFiles, Trade } from './utils/fileParser';
import { calculateMetrics, MetricsData } from './utils/calculations';

export interface LoadedFile {
  name: string;
  trades: number;
}

type TabType = 'analytics' | 'daily';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('analytics');
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loadedFiles, setLoadedFiles] = useState<LoadedFile[]>([]);
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [monthFilter, setMonthFilter] = useState<string>('all');
  const [robotFilter, setRobotFilter] = useState<string>('all');
  const [metrics, setMetrics] = useState<MetricsData | null>(null);

  const handleFilesUpload = async (files: FileList) => {
    const newTrades = await processFiles(files);
    
    const fileMap = new Map<string, number>();
    newTrades.forEach(trade => {
      fileMap.set(trade.sourceFile, (fileMap.get(trade.sourceFile) || 0) + 1);
    });
    
    const newLoadedFiles: LoadedFile[] = Array.from(fileMap.entries()).map(([name, trades]) => ({
      name,
      trades
    }));
    
    setTrades(prev => [...prev, ...newTrades]);
    setLoadedFiles(prev => {
      const existingNames = new Set(prev.map(f => f.name));
      const filesToAdd = newLoadedFiles.filter(f => !existingNames.has(f.name));
      
      const updatedPrev = prev.map(existingFile => {
        const newFile = newLoadedFiles.find(f => f.name === existingFile.name);
        if (newFile) {
          return {
            ...existingFile,
            trades: existingFile.trades + newFile.trades
          };
        }
        return existingFile;
      });
      
      return [...updatedPrev, ...filesToAdd];
    });
  };

  const handleAddFiles = async (files: FileList) => {
    await handleFilesUpload(files);
  };

  const handleRemoveFile = (filename: string) => {
    setTrades(prev => prev.filter(t => t.sourceFile !== filename));
    setLoadedFiles(prev => prev.filter(f => f.name !== filename));
  };

  const handleRemoveAll = () => {
    setTrades([]);
    setLoadedFiles([]);
    setYearFilter('all');
    setMonthFilter('all');
    setRobotFilter('all');
    setMetrics(null);
  };

  const filteredTrades = trades.filter(trade => {
    if (yearFilter !== 'all' && trade.year !== yearFilter) return false;
    if (monthFilter !== 'all' && trade.month !== monthFilter) return false;
    if (robotFilter !== 'all' && trade.robot !== robotFilter) return false;
    return true;
  });

  useEffect(() => {
    if (filteredTrades.length > 0) {
      const calculatedMetrics = calculateMetrics(filteredTrades, trades, robotFilter);
      setMetrics(calculatedMetrics);
    } else if (trades.length > 0) {
      setMetrics(null);
    }
  }, [filteredTrades.length, trades.length, robotFilter]);

  const years = [...new Set(trades.map(t => t.year))].sort();
  const months = [...new Set(trades
    .filter(t => yearFilter === 'all' || t.year === yearFilter)
    .map(t => t.month))].sort();
  const robots = [...new Set(trades.map(t => t.robot))].sort();

  // Renderiza aba de Relatório Diário
  if (activeTab === 'daily') {
    return (
      <div className="min-h-screen bg-[#0d1117] relative overflow-x-hidden">
        {/* Efeito de glow verde no fundo */}
        <div 
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh] pointer-events-none -z-10"
          style={{
            background: 'radial-gradient(circle at center, rgba(45, 255, 53, 0.15) 0%, rgba(1, 4, 9, 0) 60%)',
            filter: 'blur(150px)',
          }}
        />
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        <DailyReport />
      </div>
    );
  }

  // Renderiza aba de Analytics
  if (trades.length === 0) {
    return (
      <div className="min-h-screen bg-[#0d1117]">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        <InitialScreen onFilesUpload={handleFilesUpload} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9]">
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="p-8">
        <div className="max-w-[1400px] mx-auto space-y-8">
          <Header
            years={years}
            months={months}
            robots={robots}
            yearFilter={yearFilter}
            monthFilter={monthFilter}
            robotFilter={robotFilter}
            onYearChange={setYearFilter}
            onMonthChange={setMonthFilter}
            onRobotChange={setRobotFilter}
            onAddFiles={handleAddFiles}
            onRemoveAll={handleRemoveAll}
          />

          <FileList
            files={loadedFiles}
            onRemoveFile={handleRemoveFile}
          />

          {metrics && (
            <>
              <Highlights metrics={metrics} />
              <Metrics metrics={metrics} />

              <div>
                <h2 className="font-['Orbitron'] text-[1.2rem] text-[#c9d1d9] mb-4 border-l-4 border-[#58a6ff] pl-4">
                  Curva de Patrimônio
                </h2>
                <EquityChart data={metrics.equityData} />
              </div>

              <div>
                <h2 className="font-['Orbitron'] text-[1.2rem] text-[#c9d1d9] mb-4 border-l-4 border-[#58a6ff] pl-4">
                  Matriz Mensal
                </h2>
                <HeatMap data={metrics.heatmapData} />
              </div>

              <div className="grid md:grid-cols-2 gap-6 items-stretch">
                <WeekdayChart data={metrics.weekdayData} />
                <RobotDistChart data={metrics.robotStats} />
              </div>

              <div>
                <h2 className="font-['Orbitron'] text-[1.2rem] text-[#c9d1d9] mb-4 border-l-4 border-[#58a6ff] pl-4">
                  Performance Individual
                </h2>
                <RobotCards robots={metrics.robotStats} />
              </div>

              <div>
                <h2 className="font-['Orbitron'] text-[1.2rem] text-[#c9d1d9] mb-4 border-l-4 border-[#58a6ff] pl-4">
                  Tabela de Negócios
                </h2>
                <TradesTable trades={filteredTrades} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="bg-[#161b22] border-b border-[#30363d] sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="flex gap-1">
          <button
            onClick={() => onTabChange('analytics')}
            className={`flex items-center gap-2 px-6 py-4 font-['Orbitron'] font-semibold transition-all relative ${
              activeTab === 'analytics'
                ? 'text-[#2ea043] border-b-2 border-[#2ea043]'
                : 'text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>AUDITORIA COMPLETA</span>
          </button>
          
          <button
            onClick={() => onTabChange('daily')}
            className={`flex items-center gap-2 px-6 py-4 font-['Orbitron'] font-semibold transition-all relative ${
              activeTab === 'daily'
                ? 'text-[#2ea043] border-b-2 border-[#2ea043]'
                : 'text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>RELATÓRIO DIÁRIO</span>
          </button>
        </div>
      </div>
    </div>
  );
}