import { useRef } from 'react';
import { Upload } from 'lucide-react';

interface InitialScreenProps {
  onFilesUpload: (files: FileList) => void;
}

export function InitialScreen({ onFilesUpload }: InitialScreenProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesUpload(e.target.files);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117] p-4">
      <div className="text-center space-y-8 max-w-2xl">
        <img
          src="https://i.ibb.co/jswt9pR/LOGO-XTRADERS-Intelligence-1-1.png"
          alt="XTRADERS"
          className="w-72 mx-auto opacity-90"
        />
        
        <div className="space-y-3">
          <h1 className="font-['Orbitron'] text-[2.5rem] font-black bg-gradient-to-r from-[#58a6ff] to-[#2ea043] bg-clip-text text-transparent">
            XTRADERS INTELLIGENCE
          </h1>
          <p className="text-[#8b949e] font-['Inter']">
            Plataforma de Auditoria & Performance de Algoritmos
          </p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-3 bg-[#0d1117] border-2 border-[#58a6ff] text-[#58a6ff] px-8 py-4 rounded-xl hover:bg-[#58a6ff] hover:text-white transition-all group font-['Inter']"
        >
          <Upload className="w-6 h-6 group-hover:scale-110 transition-transform" />
          📂 CARREGAR ARQUIVOS
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="pt-8 text-sm text-[#8b949e] space-y-2 font-['Inter']">
          <p>Formatos aceitos: CSV (MT5, Planilhas)</p>
          <p>Você pode carregar múltiplos arquivos simultaneamente</p>
        </div>
      </div>
    </div>
  );
}
