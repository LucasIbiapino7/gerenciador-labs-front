// LabAdminMembro.jsx
import { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import useDebounce from '../hooks/useDebounce';

import MembrosFiltros from '../components/Membro/MembrosFiltros';
import CandidateCard from '../components/Membro/CandidateCard';
import MemberManageCard from '../components/Membro/MemberManageCard';

import {
  listarCandidatosLab,
  adicionarMembroLab,
  listarMembrosAdmin,
  promoverMembro,
  rebaixarMembro,
  desativarMembro,
  reativarMembro
} from '../services/MembroService';

import { resolveAsset } from '../utils/resolveAsset';
import { usePaginatedFetch } from '../hooks/usePaginatedFetch';
import PaginationBar from '../components/Pagination/PaginationBar';

export default function LabAdminMembro() {
  const { labId } = useOutletContext();

  const [filters, setFilters] = useState({ q: '', role: 'all' });
  const debouncedNome = useDebounce(filters.q, 600);

  const [successMsg, setSuccessMsg] = useState(null);
  const [flashId, setFlashId] = useState(null);

  const [addingId, setAddingId] = useState(null);
  const [addError, setAddError] = useState(null);

  const [roleUpdatingId, setRoleUpdatingId] = useState(null);
  const [roleError, setRoleError] = useState(null);

  // ---- Fetchers paginados ----
  const candidatosFetcher = useMemo(
    () => async ({ page, size }) => {
      const pageData = await listarCandidatosLab(labId, {
        page,
        size,
        nome: debouncedNome,
      });
      return {
        ...pageData,
        content: pageData.content.map(c => ({
          id: c.id,
          nome: c.nome,
          role: c.profileType,
          photoUrl: resolveAsset(c.photoUrl),
        })),
      };
    },
    [labId, debouncedNome]
  );

  const membrosFetcher = useMemo(
    () => async ({ page, size }) => {
      const pageData = await listarMembrosAdmin(labId, {
        page,
        size,
        nome: debouncedNome,
      });
      return {
        ...pageData,
        content: pageData.content.map(m => ({
          id: m.id,
          nome: m.nome,
          photoUrl: resolveAsset(m.photoUrl),
          profileType: m.profileType,
          labRole: m.labRole,
          ativo: m.ativo,
          canPromote: m.canPromote,
          canDemote: m.canDemote,
          canDeactivate: m.canDeactivate,
          canReactivate: m.canReactivate
        })),
      };
    },
    [labId, debouncedNome]
  );

  const {
    items: candidatos,
    page: candPage,
    size: candSize,
    totalPages: candTotalPages,
    totalElements: candTotalElements,
    loading: candLoading,
    error: candError,
    setPage: setCandPage,
    reload: reloadCandidatos,
  } = usePaginatedFetch({
    fetcher: candidatosFetcher,
    initialPage: 0,
    initialSize: 8, 
    deps: [labId, debouncedNome],
    auto: true
  });

  const {
    items: membros,
    page: memPage,
    size: memSize,
    totalPages: memTotalPages,
    totalElements: memTotalElements,
    loading: membrosLoading,
    error: membrosError,
    setPage: setMemPage,
    reload: reloadMembros,
  } = usePaginatedFetch({
    fetcher: membrosFetcher,
    initialPage: 0,
    initialSize: 8, 
    deps: [labId, debouncedNome],
    auto: true
  });

  function showTransientSuccess(msg) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  }

  function flash(memberId) {
    setFlashId(memberId);
    setTimeout(() => setFlashId(null), 800);
  }
  const roleFilter = role =>
    filters.role === 'all' || role?.toLowerCase() === filters.role;

  const nomeLower = filters.q.toLowerCase();
  const nomeFilter = nome => nome.toLowerCase().includes(nomeLower);

  const candidatosFiltrados = candidatos.filter(
    c => roleFilter(c.role) && nomeFilter(c.nome)
  );

  const membrosFiltrados = membros.filter(
    m => roleFilter(m.profileType) && nomeFilter(m.nome)
  );

  async function handleAdicionar(user) {
    setAddError(null);
    setAddingId(user.id);
    try {
      await adicionarMembroLab(labId, user.id);
      reloadCandidatos({ silent: true });
      setMemPage(0);
      reloadMembros();
      showTransientSuccess('Membro adicionado.');
      flash(user.id);
    } catch (err) {
      const st = err.response?.status;
      if (st === 404) setAddError('Lab ou usuário não encontrado.');
      else if (st === 403) setAddError('Sem permissão para adicionar.');
      else setAddError('Falha ao adicionar.');
    } finally {
      setAddingId(null);
    }
  }

  async function handlePromote(member) {
    if (!member.canPromote) return;
    setRoleError(null);
    setRoleUpdatingId(member.id);
    try {
      await promoverMembro(labId, member.id);
      reloadMembros({ silent: true });
      showTransientSuccess('Membro promovido a Admin.');
      flash(member.id);
    } catch (err) {
      const st = err.response?.status;
      if (st === 404) setRoleError('Lab ou membro não encontrado.');
      else if (st === 403) setRoleError('Sem permissão para promover.');
      else setRoleError('Falha ao promover.');
    } finally {
      setRoleUpdatingId(null);
    }
  }

  async function handleDemote(member) {
    if (!member.canDemote) return;
    setRoleError(null);
    setRoleUpdatingId(member.id);
    try {
      await rebaixarMembro(labId, member.id);
      reloadMembros({ silent: true });
      showTransientSuccess('Admin rebaixado a Membro.');
      flash(member.id);
    } catch (err) {
      const st = err.response?.status;
      if (st === 404) setRoleError('Lab ou membro não encontrado.');
      else if (st === 403) setRoleError('Sem permissão para rebaixar.');
      else setRoleError('Falha ao rebaixar.');
    } finally {
      setRoleUpdatingId(null);
    }
  }

  async function handleDeactivate(member) {
    if (!member.canDeactivate) return;
    setRoleError(null);
    setRoleUpdatingId(member.id);
    try {
      await desativarMembro(labId, member.id);
      reloadMembros({ silent: true });
      showTransientSuccess('Membro desativado.');
      flash(member.id);
    } catch (err) {
      const st = err.response?.status;
      if (st === 404) setRoleError('Lab ou membro não encontrado.');
      else if (st === 403) setRoleError('Sem permissão para desativar.');
      else setRoleError('Falha ao desativar.');
    } finally {
      setRoleUpdatingId(null);
    }
  }

  async function handleReactivate(member) {
    if (!member.canReactivate) return;
    setRoleError(null);
    setRoleUpdatingId(member.id);
    try {
      await reativarMembro(labId, member.id);
      reloadMembros({ silent: true });
      showTransientSuccess('Membro reativado.');
      flash(member.id);
    } catch (err) {
      const st = err.response?.status;
      if (st === 404) setRoleError('Lab ou membro não encontrado.');
      else if (st === 403) setRoleError('Sem permissão para reativar.');
      else setRoleError('Falha ao reativar.');
    } finally {
      setRoleUpdatingId(null);
    }
  }

  return (
    <div className="space-y-10">
      <MembrosFiltros filters={filters} setFilters={setFilters} />

      {successMsg && (
        <div className="rounded border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {successMsg}
        </div>
      )}

      {/* ==== CANDIDATOS ==== */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-baseline gap-2">
            <h2 className="text-lg font-semibold">Candidatos</h2>
            <span className="text-sm text-gray-500">
              ({candLoading ? '…' : candidatosFiltrados.length})
            </span>
        </div>

        {candError && <p className="text-sm text-red-600">{candError}</p>}
        {addError && !candError && (
          <p className="text-sm text-red-600">{addError}</p>
        )}

        {candLoading && candidatosFiltrados.length === 0 && (
          <p className="text-sm text-gray-500">Carregando…</p>
        )}

        {!candLoading && !candError && (
          candidatosFiltrados.length ? (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {candidatosFiltrados.map(u => (
                <CandidateCard
                  key={u.id}
                  user={u}
                  onAdd={() => handleAdicionar(u)}
                  disabled={addingId === u.id}
                  adding={addingId === u.id}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Nenhum candidato encontrado.</p>
          )
        )}

        {candTotalPages > 1 && (
          <div className="space-y-2 pt-2">
            <PaginationBar
              page={candPage}
              totalPages={candTotalPages}
              onPageChange={setCandPage}
            />
            <p className="text-xs text-gray-500">
              Mostrando {(candPage * candSize) + 1} – {Math.min((candPage + 1) * candSize, candTotalElements)} de {candTotalElements}
            </p>
          </div>
        )}
      </section>

      {/* ==== MEMBROS ==== */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-baseline gap-2">
          <h2 className="text-lg font-semibold">Membros atuais</h2>
          <span className="text-sm text-gray-500">
            ({membrosLoading ? '…' : membrosFiltrados.length})
          </span>
        </div>

        {membrosError && (
            <p className="text-sm text-red-600">{membrosError}</p>
        )}
        {roleError && !membrosError && (
          <p className="text-sm text-red-600">{roleError}</p>
        )}

        {membrosLoading && membrosFiltrados.length === 0 && (
          <p className="text-sm text-gray-500">Carregando…</p>
        )}

        {!membrosLoading && !membrosError && (
          membrosFiltrados.length ? (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {membrosFiltrados.map(m => (
                <MemberManageCard
                  key={m.id}
                  member={m}
                  canPromote={m.canPromote}
                  canDemote={m.canDemote}
                  canDeactivate={m.canDeactivate}
                  canReactivate={m.canReactivate}
                  onPromote={() => handlePromote(m)}
                  onDemote={() => handleDemote(m)}
                  onDeactivate={() => handleDeactivate(m)}
                  onReactivate={() => handleReactivate(m)}
                  busy={roleUpdatingId === m.id}
                  flash={flashId === m.id}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Nenhum membro corresponde aos filtros.
            </p>
          )
        )}

        {memTotalPages > 1 && (
          <div className="space-y-2 pt-2">
            <PaginationBar
              page={memPage}
              totalPages={memTotalPages}
              onPageChange={setMemPage}
            />
            <p className="text-xs text-gray-500">
              Mostrando {(memPage * memSize) + 1} – {Math.min((memPage + 1) * memSize, memTotalElements)} de {memTotalElements}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
