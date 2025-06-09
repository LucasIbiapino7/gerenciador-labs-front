import { Github, Linkedin, BookOpen } from 'lucide-react';

const bgMap = {
  professor: 'bg-amber-500',
  aluno: 'bg-cyan-500',
};

function InitialAvatar({ name, role }) {
  const initial = name.charAt(0).toUpperCase();
  const bg = bgMap[role] || 'bg-gray-500';
  return (
    <span className={`${bg} flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold text-white`}>
      {initial}
    </span>
  );
}

export default function MembroCard({ member }) {
  const { nome, role, ativo, bio, github_url, linkedin_url, link_lattes } = member;

  return (
    <div className="flex gap-4 rounded-xl bg-white p-4 shadow ring-1 ring-gray-100 hover:shadow-md">
      <InitialAvatar name={nome} role={role} />

      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <h4 className="text-lg font-medium text-gray-900">{nome}</h4>
          <span className={`rounded px-2 py-0.5 text-xs font-medium ${ativo ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
            {ativo ? 'Ativo' : 'Inativo'}
          </span>
          <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {role === 'professor' ? 'Professor' : 'Aluno'}
          </span>
        </div>

        {bio && <p className="line-clamp-2 text-sm text-gray-600">{bio}</p>}

        <div className="flex gap-3 pt-1 text-gray-500">
          {github_url && (
            <a href={github_url} target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4 hover:text-gray-700" />
            </a>
          )}
          {linkedin_url && (
            <a href={linkedin_url} target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-4 w-4 hover:text-gray-700" />
            </a>
          )}
          {link_lattes && (
            <a href={link_lattes} target="_blank" rel="noopener noreferrer">
              <BookOpen className="h-4 w-4 hover:text-gray-700" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
