import { Github, Linkedin, BookOpen, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockProfile = {
  nome: 'Aluno',
  bio: 'Bio apenas para teste',
  github_url: 'https://github.com/',
  linkedin_url: 'https://www.linkedin.com/in/',
  link_lattes: 'http://lattes.cnpq.br/',
  photoUrl: '',
};

function FallbackAvatar({ name }) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <span className="flex h-full w-full items-center justify-center rounded-full bg-primary text-4xl font-semibold text-white">
      {initial}
    </span>
  );
}

export default function MyProfile() {
  const navigate = useNavigate();
  const usuario = mockProfile;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
        <div className="relative h-40 w-40 flex-shrink-0">
          {usuario.photoUrl ? (
            <img src={usuario.photoUrl} alt={usuario.nome} className="h-full w-full rounded-full object-cover ring-4 ring-white shadow" />
          ) : (
            <FallbackAvatar name={usuario.nome} />
          )}
          <button
            onClick={() => navigate('/me/editar')}
            className="absolute bottom-2 right-2 flex items-center justify-center rounded-full bg-primary p-2 text-white shadow-md hover:bg-primary/90"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{usuario.nome}</h1>
            {usuario.bio && <p className="mt-1 text-gray-700 max-w-prose">{usuario.bio}</p>}
          </div>

          <ul className="divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-sm">
            {usuario.github_url && (
              <li className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                <Github className="h-5 w-5 text-gray-600" />
                <a href={usuario.github_url} target="_blank" rel="noopener noreferrer" className="truncate text-sm font-medium text-primary hover:underline">
                  {usuario.github_url}
                </a>
              </li>
            )}
            {usuario.linkedin_url && (
              <li className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                <Linkedin className="h-5 w-5 text-gray-600" />
                <a href={usuario.linkedin_url} target="_blank" rel="noopener noreferrer" className="truncate text-sm font-medium text-primary hover:underline">
                  {usuario.linkedin_url}
                </a>
              </li>
            )}
            {usuario.link_lattes && (
              <li className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                <BookOpen className="h-5 w-5 text-gray-600" />
                <a href={usuario.link_lattes} target="_blank" rel="noopener noreferrer" className="truncate text-sm font-medium text-primary hover:underline">
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
