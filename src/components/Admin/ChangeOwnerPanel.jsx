import { useEffect, useState, useCallback, useMemo } from 'react';
import useDebounce from '../../hooks/useDebounce';
import {
  searchProfiles,  
  patchLabOwner     
} from '../../services/AdminLabService';
import { resolveAsset } from '../../utils/resolveAsset';

const roleColorMap = {
  PROFESSOR: 'bg-amber-100 text-amber-700',
  ALUNO: 'bg-cyan-100 text-cyan-700'
};

function FallbackAvatar({ name, profileType }) {
  const initial = (name || '?').charAt(0).toUpperCase();
  const bg =
    profileType === 'PROFESSOR'
      ? 'bg-amber-500'
      : profileType === 'ALUNO'
        ? 'bg-cyan-500'
        : 'bg-gray-500';
  return (
    <span
      className={`${bg} flex h-full w-full items-center justify-center rounded-full text-sm font-semibold text-white select-none`}
    >
      {initial}
    </span>
  );
}

export default function ChangeOwnerPanel({
  lab,
  open,
  onClose,
  onSelect
}) {
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 400);

  const [users, setUsers] = useState([]);
  const [pageState, setPageState] = useState({
    page: 0,
    size: 8,
    totalPages: 0,
    last: true
  });

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [selectingId, setSelectingId] = useState(null);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setUsers([]);
      setPageState(p => ({ ...p, page: 0, totalPages: 0, last: true }));
      setError(null);
      setSelectingId(null);
    } else {
      loadPage(0, debounced, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, lab?.id]);

  useEffect(() => {
    if (open) {
      loadPage(0, debounced, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const mapUser = useCallback(u => {
    const normalized = resolveAsset(u.photoUrl);
    return {
      id: u.id,
      nome: u.nome,
      profileType: u.profileType,
      photoUrl: normalized || null,
      email: null 
    };
  }, []);

  const loadPage = useCallback(async (targetPage, searchTerm, replace = false) => {
    setError(null);
    if (targetPage === 0) setLoading(true);
    else setLoadingMore(true);

    try {
      const data = await searchProfiles({
        nome: searchTerm || '',
        page: targetPage,
        size: pageState.size
      });

      const content = (data.content || []).map(mapUser);

      setUsers(prev => (replace ? content : [...prev, ...content]));
      setPageState({
        page: data.number,
        size: data.size,
        totalPages: data.totalPages,
        last: data.last
      });
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        setError('Sem permissão para listar usuários.');
      } else {
        setError('Falha ao carregar usuários.');
      }
      if (targetPage === 0) {
        setUsers([]);
        setPageState(p => ({ ...p, page: 0, totalPages: 0, last: true }));
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [mapUser, pageState.size]);

  function loadMore() {
    if (pageState.last || loadingMore) return;
    loadPage(pageState.page + 1, debounced, false);
  }

  async function handleSelect(user) {
    if (selectingId) return;
    setSelectingId(user.id);
    try {
      await patchLabOwner(lab.id, user.id);
      onSelect?.(user);
      onClose();
    } catch (err) {
      console.error(err);
      setError('Não foi possível definir owner.');
    } finally {
      setSelectingId(null);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/30">
      <div className="flex h-full w-full max-w-md flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h3 className="text-sm font-semibold text-gray-800">
            {lab?.owner ? 'Alterar Owner' : 'Definir Owner'}
            {lab && <span className="ml-1 text-gray-400">· {lab.nome}</span>}
          </h3>
          <button
            onClick={onClose}
            className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
          >
            Fechar
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Buscar usuário
            </label>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Nome (ou deixe vazio)"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-gray-400">
              Limpo = lista todos. Debounce 400ms.
            </p>
          </div>

          {error && (
            <div className="rounded border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </div>
          )}

          <div className="max-h-80 space-y-2 overflow-auto pr-1">
            {loading && users.length === 0 && (
              <p className="text-xs text-gray-500">Carregando…</p>
            )}

            {!loading && !error && users.length === 0 && (
              <p className="text-xs text-gray-500">
                Nenhum usuário encontrado.
              </p>
            )}

            {users.map(u => {
              const isCurrent = lab?.owner?.id === u.id;

              return (
                <button
                  key={u.id}
                  disabled={!!selectingId}
                  onClick={() => handleSelect(u)}
                  className="group flex w-full items-center gap-3 rounded border border-gray-200 px-3 py-2 text-left hover:border-primary/50 hover:bg-primary/5 disabled:opacity-50"
                >
                  <AvatarThumb user={u} busy={selectingId === u.id} />
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-medium text-gray-800 group-hover:text-primary">
                      {u.nome}
                    </span>
                    <span
                      className={`mt-1 inline-flex w-fit rounded px-2 py-0.5 text-[10px] font-semibold ${
                        roleColorMap[u.profileType] || 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {u.profileType}
                    </span>
                    {isCurrent && (
                      <span className="mt-1 text-[10px] font-medium text-primary">
                        (Owner atual)
                      </span>
                    )}
                    {selectingId === u.id && (
                      <span className="mt-1 text-[10px] text-primary">
                        Aplicando…
                      </span>
                    )}
                  </div>
                </button>
              );
            })}

            {!pageState.last && users.length > 0 && (
              <div className="pt-2">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="w-full rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium hover:bg-gray-50 disabled:opacity-50"
                >
                  {loadingMore ? 'Carregando…' : 'Carregar mais'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-auto border-t p-4 text-right">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

function AvatarThumb({ user, busy }) {
  const [broken, setBroken] = useState(false);
  const showImg = user.photoUrl && !broken;

  const normalized = useMemo(() => user.photoUrl, [user.photoUrl]);

  return (
    <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-xs font-semibold text-gray-600 ring-1 ring-white">
      {showImg ? (
        <img
          src={normalized}
          alt={user.nome}
          className="h-full w-full object-cover"
          onError={() => setBroken(true)}
          draggable={false}
        />
      ) : (
        <FallbackAvatar name={user.nome} profileType={user.profileType} />
      )}
      {busy && (
        <span className="absolute inset-0 rounded-full bg-white/60 text-[9px] font-medium text-primary flex items-center justify-center">
          …
        </span>
      )}
    </div>
  );
}
