import { useEffect, useState } from 'react';
import { Github, Linkedin, BookOpen, Edit2, IdCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getMeuPerfil } from '../services/ProfileService';
import { resolveAsset } from '../utils/resolveAsset';

function FallbackAvatar({ name }) {
  const initial = (name || '?').charAt(0).toUpperCase();
  return (
    <span className="flex h-full w-full items-center justify-center rounded-full bg-primary text-4xl font-semibold text-white select-none">
      {initial}
    </span>
  );
}

export default function MyProfile() {
  const navigate = useNavigate();

  const [perfil, setPerfil]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro]       = useState(null);

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    setErro(null);

    getMeuPerfil()
      .then(data => {
        if (cancel) return;
        setPerfil({
          ...data,
          photoUrl: resolveAsset(data.photoUrl)
        });
      })
      .catch(err => {
        if (cancel) return;
        const st = err.response?.status;
        if (st === 401) setErro('Sessão expirada. Faça login novamente.');
        else setErro('Não foi possível carregar seu perfil.');
      })
      .finally(() => !cancel && setLoading(false));

    return () => { cancel = true; };
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-sm text-gray-600">Carregando perfil…</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 space-y-4">
        <p className="text-sm text-red-600">{erro}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!perfil) return null;

  const {
    nome,
    bio,
    linkGithub,
    linkLinkedin,
    linkLattes,
    idLattes,
    photoUrl,
    profileType
  } = perfil;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-10">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
        <div className="relative h-40 w-40 flex-shrink-0">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={nome}
              className="h-full w-full rounded-full object-cover ring-4 ring-white shadow"
              draggable={false}
            />
          ) : (
            <FallbackAvatar name={nome} />
          )}
          <button
            onClick={() => navigate('/me/editar')}
            className="absolute bottom-2 right-2 flex items-center justify-center rounded-full bg-primary p-2 text-white shadow-md hover:bg-primary/90"
            title="Editar perfil"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900">
              {nome}
              {profileType && (
                <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                  {profileType === 'PROFESSOR' ? 'Professor' : 'Aluno'}
                </span>
              )}
            </h1>
            {bio && (
              <p className="mt-1 max-w-prose whitespace-pre-line text-gray-700">
                {bio}
              </p>
            )}
          </div>

          <ul className="divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-sm">
            {linkGithub && (
              <li className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                <Github className="h-5 w-5 text-gray-600" />
                <a
                  href={linkGithub}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-sm font-medium text-primary hover:underline"
                >
                  {linkGithub}
                </a>
              </li>
            )}
            {linkLinkedin && (
              <li className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                <Linkedin className="h-5 w-5 text-gray-600" />
                <a
                  href={linkLinkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-sm font-medium text-primary hover:underline"
                >
                  {linkLinkedin}
                </a>
              </li>
            )}
            {linkLattes && (
              <li className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                <BookOpen className="h-5 w-5 text-gray-600" />
                <a
                  href={linkLattes}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-sm font-medium text-primary hover:underline"
                >
                  Lattes
                </a>
              </li>
            )}
            {idLattes && (
              <li className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                <IdCard className="h-5 w-5 text-gray-600" />
                <span className="truncate text-sm font-medium text-gray-700">
                  ID Lattes: {idLattes}
                </span>
              </li>
            )}
            {!linkGithub && !linkLinkedin && !linkLattes && !idLattes && (
              <li className="px-4 py-3 text-sm text-gray-500">
                Nenhum link de perfil cadastrado ainda.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
