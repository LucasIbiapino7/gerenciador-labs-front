import { Github, Linkedin, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { resolveAsset } from '../../utils/resolveAsset';

const bgMap = {
  professor: 'bg-amber-500',
  aluno: 'bg-cyan-500',
};

function FallbackAvatar({ name, role }) {
  const initial = (name || '?').charAt(0).toUpperCase();
  const bg = bgMap[role] || 'bg-gray-500';
  return (
    <span
      className={`${bg} flex h-full w-full items-center justify-center rounded-full text-lg font-semibold text-white select-none`}
    >
      {initial}
    </span>
  );
}

export default function MemberCard({ member, isAdmin }) {
  const navigate = useNavigate();

  const {
    id,
    nome,
    bio,
    role,
    ativo,
    github_url, 
    linkedin_url,
    link_lattes,
    linkGithub,  
    linkLinkedin,
    linkLattes,
    photoUrl,
  } = member;

  const gh = github_url   || linkGithub   || '';
  const li = linkedin_url || linkLinkedin || '';
  const latt = link_lattes  || linkLattes   || '';

  const normalizedPhoto = useMemo(() => resolveAsset(photoUrl), [photoUrl]);

  const [broken, setBroken] = useState(false);
  const showPhoto = normalizedPhoto && !broken;

  return (
    <div
      onClick={() => navigate(`/users/${id}`)}
      className="relative cursor-pointer rounded-xl bg-white p-4 text-center ring-1 ring-gray-200 shadow-sm transition transform hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full">
        {showPhoto ? (
          <img
            src={normalizedPhoto}
            alt={nome}
            className="h-full w-full rounded-full object-cover ring-4 ring-white shadow"
            onError={() => setBroken(true)}
            draggable={false}
          />
        ) : (
          <FallbackAvatar name={nome} role={role} />
        )}
        <span
          className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full ring-2 ring-white ${
            ativo ? 'bg-green-500' : 'bg-gray-400'
          }`}
          title={ativo ? 'Ativo' : 'Inativo'}
        />
        {!ativo && (
          <span className="absolute inset-0 rounded-full bg-white/40 backdrop-blur-[1px]" />
        )}
      </div>

      <h4 className="mt-3 text-lg font-semibold text-gray-900 line-clamp-2">
        {nome}
      </h4>

      <div className="mt-1 flex flex-wrap justify-center gap-2">
        <span
          className={`rounded px-2 py-0.5 text-xs font-medium ${
            ativo ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
          }`}
        >
          {ativo ? 'Ativo' : 'Ex membro'}
        </span>
        <span
          className={`rounded px-2 py-0.5 text-xs font-medium ${
            role === 'professor'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-cyan-100 text-cyan-700'
          }`}
        >
          {role === 'professor' ? 'Professor' : 'Aluno'}
        </span>
        {isAdmin && (
          <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
            admin view
          </span>
        )}
      </div>

      {bio && (
        <p className="mt-2 line-clamp-2 text-sm text-gray-600">{bio}</p>
      )}

      <div className="mt-3 flex justify-center gap-3 text-gray-500">
        {gh && (
          <a
            href={gh}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            title="GitHub"
          >
            <Github className="h-5 w-5 hover:text-gray-700" />
          </a>
        )}
        {li && (
          <a
            href={li}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            title="LinkedIn"
          >
            <Linkedin className="h-5 w-5 hover:text-gray-700" />
          </a>
        )}
        {latt && (
          <a
            href={latt}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            title="Lattes"
          >
            <BookOpen className="h-5 w-5 hover:text-gray-700" />
          </a>
        )}
      </div>
    </div>
  );
}
