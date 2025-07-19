import { useState, useEffect, useCallback } from 'react';
import useDebounce from '../../hooks/useDebounce';
import { searchProfiles, updateProfileType } from '../../services/AdminLabService';
import UserAdminCard from './UserAdminCard';

export default function AdminUsersTab() {
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 500);

  const [typeFilter, setTypeFilter] = useState('ALL');
  const [users, setUsers] = useState([]);
  const [pageState, setPageState] = useState({
    page: 0,
    size: 12,
    totalPages: 0,
    last: true
  });

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const [actionBusyId, setActionBusyId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    loadPage(0, debounced, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced, typeFilter]);

  const mapUser = useCallback(
    (u) => ({
      id: u.id,
      nome: u.nome,
      photoUrl: u.photoUrl || null,
      profileType: u.profileType,
      bio: u.bio,
      idLattes: u.idLattes
    }),
    []
  );

  async function loadPage(targetPage, searchTerm, replace = false) {
    if (targetPage === 0) {
      setLoading(true);
      setError(null);
    } else {
      setLoadingMore(true);
    }
    try {
      const data = await searchProfiles({
        nome: searchTerm || '',
        page: targetPage,
        size: pageState.size
      });

      let content = (data.content || []).map(mapUser);

      if (typeFilter !== 'ALL') {
        content = content.filter((c) => c.profileType === typeFilter);
      }

      setUsers((prev) => (replace ? content : [...prev, ...content]));
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
        setPageState({
          page: 0,
          size: pageState.size,
          totalPages: 0,
          last: true
        });
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  function loadMore() {
    if (pageState.last || loadingMore) return;
    loadPage(pageState.page + 1, debounced, false);
  }

  function flash(msg) {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2500);
  }

  async function handleSetProfessor(user) {
    setActionBusyId(user.id);
    try {
      await updateProfileType(user.id, 'PROFESSOR');
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, profileType: 'PROFESSOR' } : u))
      );
      flash('Perfil atualizado para PROFESSOR.');
    } catch (err) {
      console.error(err);
      flash('Erro ao definir como Professor.');
    } finally {
      setActionBusyId(null);
    }
  }

  async function handleSetAluno(user) {
    setActionBusyId(user.id);
    try {
      await updateProfileType(user.id, 'ALUNO');
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, profileType: 'ALUNO' } : u))
      );
      flash('Perfil atualizado para ALUNO.');
    } catch (err) {
      console.error(err);
      flash('Erro ao definir como Aluno.');
    } finally {
      setActionBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-gray-700">
                Buscar
              </label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nome do usuário…"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                Tipo
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                <option value="ALL">Todos</option>
                <option value="ALUNO">Alunos</option>
                <option value="PROFESSOR">Professores</option>
              </select>
            </div>
          </div>
        </div>

        {feedback && (
          <div className="rounded border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
            {feedback}
          </div>
        )}
      </header>

      {error && (
        <div className="rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && users.length === 0 && (
        <p className="text-sm text-gray-500">Carregando usuários…</p>
      )}

      {!loading && !error && users.length === 0 && (
        <p className="text-sm text-gray-500">Nenhum usuário encontrado.</p>
      )}

      {users.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {users.map((u) => (
            <UserAdminCard
              key={u.id}
              user={u}
              onSetProfessor={handleSetProfessor}
              onSetAluno={handleSetAluno}
              busy={actionBusyId === u.id}
            />
          ))}
        </div>
      )}

      {!error && users.length > 0 && !pageState.last && (
        <div className="flex justify-center pt-4">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            {loadingMore ? 'Carregando…' : 'Carregar mais'}
          </button>
        </div>
      )}

      <p className="text-center text-[11px] text-gray-400">
        Página {pageState.page + 1} de {pageState.totalPages || 1} · {users.length} itens carregados
      </p>
    </div>
  );
}
