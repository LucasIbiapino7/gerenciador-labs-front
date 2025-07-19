import { useEffect, useState } from 'react';
import { ArrowLeft, Github, Linkedin, BookOpen, Fingerprint } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPerfilPublico } from '../services/ProfileService';
import { resolveAsset } from '../utils/resolveAsset'; 

function FallbackAvatar({ name }) {
  const initial = (name || '?').charAt(0).toUpperCase();
  return (
    <span className="flex h-full w-full items-center justify-center rounded-full bg-primary text-4xl font-semibold text-white select-none">
      {initial}
    </span>
  );
}

export default function PerfilPublico() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [perfil, setPerfil]     = useState(null);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError]       = useState(null);
  const [imgBroken, setImgBroken] = useState(false);

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    setError(null);
    setNotFound(false);
    setPerfil(null);
    setImgBroken(false);

    getPerfilPublico(userId)
      .then(data => {
        if (cancel) return;
        // Normaliza a foto (se vier só o filename)
        const normalized = {
          ...data,
          photoUrl: resolveAsset(data.photoUrl),
        };
        setPerfil(normalized);
      })
      .catch(err => {
        if (cancel) return;
        const st = err.response?.status;
        if (st === 404) setNotFound(true);
        else setError('Não foi possível carregar o perfil.');
      })
      .finally(() => !cancel && setLoading(false));

    return () => { cancel = true; };
  }, [userId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>
        <p className="text-sm text-gray-600">Carregando perfil…</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>
        <div className="rounded border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          Perfil não encontrado (404).
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>
        <div className="rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!perfil) return null;

  const {
    nome,
    bio,
    photoUrl,
    linkGithub,
    linkLinkedin,
    linkLattes,
    idLattes,
    profileType,
  } = perfil;

  const showPhoto = photoUrl && !imgBroken;

  const typeBadge =
    profileType === 'PROFESSOR'
      ? 'Professor'
      : profileType === 'ALUNO'
      ? 'Aluno'
      : (profileType || '');

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
          {showPhoto ? (
            <img
              src={photoUrl}
              alt={nome}
              className="h-full w-full rounded-full object-cover ring-4 ring-white shadow"
              draggable={false}
              onError={() => setImgBroken(true)}
            />
          ) : (
            <FallbackAvatar name={nome} />
          )}
        </div>

        <div className="flex-1 space-y-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">{nome}</h1>
              {typeBadge && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  {typeBadge}
                </span>
              )}
              {idLattes && (
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                  <Fingerprint className="h-3 w-3" />
                  ID Lattes: {idLattes}
                </span>
              )}
            </div>
            {bio && (
              <p className="text-gray-700 max-w-prose whitespace-pre-line">
                {bio}
              </p>
            )}
          </div>

          <ul className="divide-y divide-gray-100 overflow-hidden rounded-md border border-gray-100 bg-white shadow-sm">
            {linkGithub && (
              <li className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                <Github className="h-5 w-5 text-gray-600" />
                <a
                  href={linkGithub}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-sm font-medium text-primary hover:underline"
                  title={linkGithub}
                >
                  {linkGithub.replace(/^https?:\/\//, '')}
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
                  title={linkLinkedin}
                >
                  {linkLinkedin.replace(/^https?:\/\//, '')}
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
                  title={linkLattes}
                >
                  Lattes
                </a>
              </li>
            )}
            {!linkGithub && !linkLinkedin && !linkLattes && (
              <li className="px-4 py-3 text-xs text-gray-500">
                Nenhum link público informado.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
