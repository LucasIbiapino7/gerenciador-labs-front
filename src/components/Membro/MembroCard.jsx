import { Github, Linkedin, BookOpen, Lock } from 'lucide-react';

const bgMap = {
  professor: 'bg-amber-500',
  aluno: 'bg-cyan-500',
};

function FallbackAvatar({ name, role }) {
  const initial = name.charAt(0).toUpperCase();
  const bg = bgMap[role] || 'bg-gray-500';
  return (
    <span className={`${bg} flex h-full w-full items-center justify-center rounded-full text-lg font-semibold text-white`}>
      {initial}
    </span>
  );
}

export default function MemberCard({ member, isAdmin }) {
  const {
    nome,
    bio,
    role,
    ativo,
    github_url,
    linkedin_url,
    link_lattes,
    photoUrl,
  } = member;

  return (
    <div className="relative rounded-xl bg-white p-4 text-center ring-1 ring-gray-200 shadow-sm transition transform hover:-translate-y-1 hover:shadow-lg">

      <div className="relative mx-auto h-20 w-20">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={nome}
            className="h-full w-full rounded-full object-cover ring-4 ring-white shadow"
          />
        ) : (
          <FallbackAvatar name={nome} role={role} />
        )}

        <span
          className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full ring-2 ring-white ${ativo ? 'bg-green-500' : 'bg-gray-400'}`}
        />
      </div>

      <h4 className="mt-3 text-lg font-semibold text-gray-900">{nome}</h4>

      <div className="mt-1 flex justify-center gap-2">
        <span className={`rounded px-2 py-0.5 text-xs font-medium ${ativo ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
          {ativo ? 'Ativo' : 'Ex membro'}
        </span>
        <span className={`rounded px-2 py-0.5 text-xs font-medium ${role === 'professor' ? 'bg-amber-100 text-amber-700' : 'bg-cyan-100 text-cyan-700'}`}>
          {role === 'professor' ? 'Professor' : 'Aluno'}
        </span>
      </div>

      {bio && <p className="mt-2 line-clamp-2 text-sm text-gray-600">{bio}</p>}

      <div className="mt-3 flex justify-center gap-3 text-gray-500">
        {github_url && (
          <a href={github_url} target="_blank" rel="noopener noreferrer">
            <Github className="h-5 w-5 hover:text-gray-700" />
          </a>
        )}
        {linkedin_url && (
          <a href={linkedin_url} target="_blank" rel="noopener noreferrer">
            <Linkedin className="h-5 w-5 hover:text-gray-700" />
          </a>
        )}
        {link_lattes && (
          <a href={link_lattes} target="_blank" rel="noopener noreferrer">
            <BookOpen className="h-5 w-5 hover:text-gray-700" />
          </a>
        )}
      </div>
    </div>
  );
}
