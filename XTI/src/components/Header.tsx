import { useRef } from 'react';
import { Upload, Trash2 } from 'lucide-react';

interface HeaderProps {
  years: string[];
  months: string[];
  robots: string[];
  yearFilter: string;
  monthFilter: string;
  robotFilter: string;
  onYearChange: (year: string) => void;
  onMonthChange: (month: string) => void;
  onRobotChange: (robot: string) => void;
  onAddFiles: (files: FileList) => void;
  onRemoveAll: () => void;
}

export function Header({
  years,
  months,
  robots,
  yearFilter,
  monthFilter,
  robotFilter,
  onYearChange,
  onMonthChange,
  onRobotChange,
  onAddFiles,
  onRemoveAll
}: HeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleRemoveClick = () => {
    if (confirm('Tem certeza que deseja remover TODOS os dados e voltar à tela inicial?')) {
      onRemoveAll();
    }
  };

  return (
    <header className="bg-[#161b22] rounded-xl border border-[#30363d] shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
      <div className="p-6">
        {/* Logo e Ações */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-[#30363d]">
          <img 
            src="https://i.ibb.co/jswt9pR/LOGO-XTRADERS-Intelligence-1-1.png" 
            alt="XTRADERS" 
            className="h-10 w-auto"
          />
          
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] px-5 py-3 rounded-lg hover:border-[#58a6ff] hover:bg-[#21262d] transition-all font-['Inter']"
            >
              <Upload className="w-4 h-4" />
              📥 Adicionar Arquivos
            </button>
            
            <button
              onClick={handleRemoveClick}
              className="flex items-center gap-2 bg-[#0d1117] border border-[#da3633] text-[#da3633] px-5 py-3 rounded-lg hover:bg-[rgba(218,54,51,0.1)] transition-all font-['Inter']"
            >
              <Trash2 className="w-4 h-4" />
              🗑️ Remover Todos
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Filtros */}
        <div className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <select
              value={yearFilter}
              onChange={(e) => onYearChange(e.target.value)}
              className="bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] rounded-lg px-5 py-3 hover:border-[#58a6ff] hover:bg-[#21262d] transition-all focus:outline-none focus:border-[#58a6ff] font-['Inter'] text-[0.9rem] min-w-[150px]"
            >
              <option value="all">📅 Todos os Anos</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <select
              value={monthFilter}
              onChange={(e) => onMonthChange(e.target.value)}
              className="bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] rounded-lg px-5 py-3 hover:border-[#58a6ff] hover:bg-[#21262d] transition-all focus:outline-none focus:border-[#58a6ff] font-['Inter'] text-[0.9rem] min-w-[150px]"
            >
              <option value="all">🗓️ Todos os Meses</option>
              {months.map(month => {
                const [year, m] = month.split('-');
                return (
                  <option key={month} value={month}>{`${m}/${year}`}</option>
                );
              })}
            </select>

            <select
              value={robotFilter}
              onChange={(e) => onRobotChange(e.target.value)}
              className="bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] rounded-lg px-5 py-3 hover:border-[#58a6ff] hover:bg-[#21262d] transition-all focus:outline-none focus:border-[#58a6ff] font-['Inter'] text-[0.9rem] min-w-[150px]"
            >
              <option value="all">🤖 Todos os Robôs</option>
              {robots.map(robot => (
                <option key={robot} value={robot}>{robot}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
