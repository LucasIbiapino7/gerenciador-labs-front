import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import InitialAvatar from './InitialAvatar';

export default function PostCard({ item }) {
  const { author, lab } = item;
  const timeAgo = formatDistanceToNow(new Date(item.dataHora), {
    addSuffix: true,
    locale: ptBR,
  });

  return (
    <div className="relative overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:shadow-md">
      <span className="absolute inset-y-0 left-0 w-1 bg-primary" />

      <div className="flex items-start gap-3 p-5 sm:p-6">
        <InitialAvatar name={author.nome} color="cyan" />

        <div className="flex-1 space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="font-medium text-gray-900">{author.nome}</span>
            <span className="text-xs text-gray-500">{timeAgo}</span>
          </div>

          {item.titulo && (
            <h4 className="font-semibold text-gray-900">{item.titulo}</h4>
          )}

          <p className="whitespace-pre-line text-sm text-gray-700">
            {item.conteudo}
          </p>
        </div>

        <span className="ml-auto hidden rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary sm:inline">
          {lab.nome}
        </span>
      </div>
    </div>
  );
}
