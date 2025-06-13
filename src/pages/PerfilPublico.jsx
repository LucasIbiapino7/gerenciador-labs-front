import { ArrowLeft, Github, Linkedin, BookOpen } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const mockUsers = {
  1: {
    nome: 'Ana Beatriz',
    bio: 'Apaixonada por Clean Code e TDD.',
    github_url: 'https://github.com/anabeatriz',
    linkedin_url: 'https://linkedin.com/in/anabeatriz',
    link_lattes: 'http://lattes.cnpq.br',
    photoUrl: '',
  },
  2: {
    nome: 'Rafael Costa',
    bio: 'Dev Java e React. Sempre aprendendo.',
    github_url: 'https://github.com/',
    linkedin_url: '',
    link_lattes: '',
    photoUrl: '',
  },
};

function FallbackAvatar({ name }) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <span className="flex h-full w-full items-center justify-center rounded-full bg-primary text-4xl font-semibold text-white">
      {initial}
    </span>
  );
}

export default function PerfilPublico() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const u = mockUsers[userId] || mockUsers[1];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>

      <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
        <div className="h-40 w-40 flex-shrink-0">
          {u.photoUrl ? (
            <img src={u.photoUrl} alt={u.nome} className="h-full w-full rounded-full object-cover ring-4 ring-white shadow" />
          ) : (
            <FallbackAvatar name={u.nome} />
          )}
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{u.nome}</h1>
            {u.bio && <p className="mt-1 text-gray-700 max-w-prose">{u.bio}</p>}
          </div>
          <ul className="divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-sm">
            {u.github_url && (
              <li className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                <Github className="h-5 w-5 text-gray-600" />
                <a href={u.github_url} target="_blank" rel="noopener noreferrer" className="truncate text-sm font-medium text-primary hover:underline">
                  {u.github_url.replace('https://', '')}
                </a>
              </li>
            )}
            {u.linkedin_url && (
              <li className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                <Linkedin className="h-5 w-5 text-gray-600" />
                <a href={u.linkedin_url} target="_blank" rel="noopener noreferrer" className="truncate text-sm font-medium text-primary hover:underline">
                  {u.linkedin_url.replace('https://', '')}
                </a>
              </li>
            )}
            {u.link_lattes && (
              <li className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                <BookOpen className="h-5 w-5 text-gray-600" />
                <a href={u.link_lattes} target="_blank" rel="noopener noreferrer" className="truncate text-sm font-medium text-primary hover:underline">
                  Lattes
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
