import { X, File } from 'lucide-react';
import { LoadedFile } from '../App';

interface FileListProps {
  files: LoadedFile[];
  onRemoveFile: (filename: string) => void;
}

export function FileList({ files, onRemoveFile }: FileListProps) {
  if (files.length === 0) return null;

  const handleRemove = (filename: string) => {
    if (confirm(`Tem certeza que deseja remover o arquivo "${filename}"?`)) {
      onRemoveFile(filename);
    }
  };

  return (
    <div className="bg-[#21262d] rounded-xl border border-[#30363d] p-4">
      <h3 className="text-[0.85rem] mb-3 text-[#c9d1d9] font-['Inter'] font-bold">
        Arquivos Carregados:
      </h3>
      
      <div className="space-y-0">
        {files.map((file, index) => (
          <div
            key={`${file.name}-${index}`}
            className={`flex items-center justify-between py-2 text-[0.9rem] text-[#8b949e] ${
              index !== files.length - 1 ? 'border-b border-dashed border-[rgba(255,255,255,0.05)]' : ''
            }`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <File className="w-4 h-4 text-[#58a6ff] flex-shrink-0" />
              <span className="text-[#c9d1d9] truncate font-['Inter']">{file.name}</span>
            </div>
            
            <button
              onClick={() => handleRemove(file.name)}
              className="ml-3 text-[#da3633] hover:text-[#58a6ff] transition-colors font-bold text-lg cursor-pointer"
              title={`Remover ${file.name}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}