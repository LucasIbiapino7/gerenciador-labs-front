import { FileText, Presentation, PlayCircle, Github, Link as LinkIcon, Lock } from 'lucide-react';

function iconByType(tipo) {
  switch (tipo) {
    case 'pdf':
      return <FileText className="h-7 w-7 text-rose-500" />;
    case 'slide':
      return <Presentation className="h-7 w-7 text-amber-500" />;
    case 'video':
      return <PlayCircle className="h-7 w-7 text-violet-500" />;
    case 'repo':
      return <Github className="h-7 w-7 text-gray-800" />;
    default:
      return <LinkIcon className="h-7 w-7 text-primary" />;
  }
}

export default function MaterialCard({ item, isAdmin, onEdit }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-white p-4 ring-1 ring-gray-100 shadow hover:shadow-md">
      <div className="flex items-center gap-2">
        {iconByType(item.tipo)}
        {item.visibilidade === 'PRIVADO' && <Lock className="h-4 w-4 text-gray-500" />}
      </div>
      <h4 className="font-medium text-gray-900 line-clamp-2">{item.titulo}</h4>
      {item.descricao && <p className="line-clamp-2 text-sm text-gray-600">{item.descricao}</p>}
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        Abrir ↗
      </a>
      {isAdmin && (
        <button
          onClick={() => onEdit(item)}
          className="self-end text-xs text-gray-400 hover:text-gray-600"
        >
          ✎ editar
        </button>
      )}
    </div>
  );
}
