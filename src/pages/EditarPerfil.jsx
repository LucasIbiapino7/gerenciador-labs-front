import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMeuPerfil, updateMeuPerfil, uploadAvatar } from '../services/ProfileService';

function resolvePhoto(raw) {
  if (!raw) return '';
  if (raw.includes('://')) return raw;
  const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';
  return `${base}/api/files/download/${raw}`;
}

export default function EditProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: '',
    bio: '',
    linkGithub: '',
    linkLinkedin: '',
    linkLattes: '',
    idLattes: '',
    photoUrl: ''
  });

  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);

  // Upload avatar states
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError]         = useState(null);
  const [avatarSuccess, setAvatarSuccess]     = useState(false);

  const [error, setError]             = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess]         = useState(false);

  /* Carrega perfil atual */
  useEffect(() => {
    let cancel = false;
    setLoading(true);
    setError(null);
    getMeuPerfil()
      .then(data => {
        if (cancel) return;
        setForm({
          nome: data.nome || '',
          bio: data.bio || '',
            linkGithub: data.linkGithub || '',
          linkLinkedin: data.linkLinkedin || '',
          linkLattes: data.linkLattes || '',
          idLattes: data.idLattes || '',
          photoUrl: resolvePhoto(data.photoUrl)
        });
      })
      .catch(err => {
        if (cancel) return;
        const st = err.response?.status;
        if (st === 401) setError('Sessão expirada. Faça login novamente.');
        else setError('Não foi possível carregar seu perfil.');
      })
      .finally(() => !cancel && setLoading(false));

    return () => { cancel = true; };
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Limpa erro específico
    setFieldErrors(prev => {
      if (!prev[name]) return prev;
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setError(null);
    setFieldErrors({});
    setSuccess(false);

    try {
      const updated = await updateMeuPerfil(form);
      setForm(prev => ({
        ...prev,
        nome: updated.nome || '',
        bio: updated.bio || '',
        linkGithub: updated.linkGithub || '',
        linkLinkedin: updated.linkLinkedin || '',
        linkLattes: updated.linkLattes || '',
        idLattes: updated.idLattes || '',
        photoUrl: resolvePhoto(updated.photoUrl) || prev.photoUrl
      }));
      setSuccess(true);
    } catch (err) {
      const st = err.response?.status;
      if (st === 422) {
        const errs = err.response.data.errors || [];
        const map = {};
        errs.forEach(e => {
          if (e.fieldName) map[e.fieldName] = e.message;
        });
        setFieldErrors(map);
        setError('Corrija os campos destacados.');
      } else if (st === 403) {
        setError('Você não tem permissão para editar este perfil.');
      } else if (st === 401) {
        setError('Sessão expirada. Faça login novamente.');
      } else {
        setError('Falha ao salvar o perfil.');
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarError(null);
    setAvatarSuccess(false);

    const previous = form.photoUrl;
    const tempUrl = URL.createObjectURL(file); // preview otimista
    setForm(prev => ({ ...prev, photoUrl: tempUrl }));

    setUploadingAvatar(true);
    try {
      const res = await uploadAvatar(file);
      const finalUrl = res.url
        ? res.url
        : resolvePhoto(res.fileName);

      setForm(prev => ({ ...prev, photoUrl: finalUrl }));
      setAvatarSuccess(true);
      setTimeout(() => setAvatarSuccess(false), 2500);
    } catch (err) {
      console.error(err);
      setForm(prev => ({ ...prev, photoUrl: previous }));
      if (err.response?.status === 403) {
        setAvatarError('Sem permissão para enviar foto.');
      } else if (err.response?.status === 401) {
        setAvatarError('Sessão expirada. Faça login novamente.');
      } else {
        setAvatarError('Falha no upload da imagem.');
      }
    } finally {
      setUploadingAvatar(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-sm text-gray-600">Carregando dados…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Editar perfil</h1>
        <button
          type="button"
          onClick={() => navigate('/me')}
          className="text-sm font-medium text-primary hover:underline"
        >
          Voltar
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Perfil atualizado com sucesso!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Avatar + upload */}
        <div className="flex items-center gap-6">
          <div className="h-20 w-20 overflow-hidden rounded-full ring-2 ring-white shadow">
            {form.photoUrl ? (
              <img
                src={form.photoUrl}
                alt={form.nome}
                className="h-full w-full object-cover"
                draggable={false}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200 text-2xl font-semibold text-gray-600">
                {form.nome?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded bg-primary px-3 py-2 text-sm font-medium text-white shadow hover:bg-primary/90">
              {uploadingAvatar ? 'Enviando…' : 'Trocar foto'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={uploadingAvatar}
              />
            </label>
            {avatarError && <p className="text-xs text-red-600">{avatarError}</p>}
            {avatarSuccess && (
              <p className="text-xs text-emerald-600">Foto atualizada!</p>
            )}
            <p className="text-[11px] text-gray-500">
              A foto é salva imediatamente ao selecionar.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Nome <span className="text-red-500">*</span>
            </label>
            <input
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
              className={`w-full rounded border px-3 py-2 text-sm focus:outline-none focus:border-primary ${
                fieldErrors.nome ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {fieldErrors.nome && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.nome}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Bio</label>
            <textarea
              name="bio"
              rows={4}
              value={form.bio}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">GitHub</label>
            <input
              name="linkGithub"
              type="url"
              placeholder="https://github.com/seuuser"
              value={form.linkGithub}
              onChange={handleChange}
              className={`w-full rounded border px-3 py-2 text-sm focus:outline-none focus:border-primary ${
                fieldErrors.linkGithub ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {fieldErrors.linkGithub && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.linkGithub}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">LinkedIn</label>
            <input
              name="linkLinkedin"
              type="url"
              placeholder="https://www.linkedin.com/in/..."
              value={form.linkLinkedin}
              onChange={handleChange}
              className={`w-full rounded border px-3 py-2 text-sm focus:outline-none focus:border-primary ${
                fieldErrors.linkLinkedin ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {fieldErrors.linkLinkedin && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.linkLinkedin}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Lattes (URL)</label>
            <input
              name="linkLattes"
              type="url"
              placeholder="http://lattes.cnpq.br/..."
              value={form.linkLattes}
              onChange={handleChange}
              className={`w-full rounded border px-3 py-2 text-sm focus:outline-none focus:border-primary ${
                fieldErrors.linkLattes ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {fieldErrors.linkLattes && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.linkLattes}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">ID Lattes</label>
            <input
              name="idLattes"
              value={form.idLattes}
              onChange={handleChange}
              className={`w-full rounded border px-3 py-2 text-sm focus:outline-none focus:border-primary ${
                fieldErrors.idLattes ? 'border-red-400' : 'border-gray-300'
              }`}
              placeholder="Ex: 1234567890123456"
            />
            {fieldErrors.idLattes && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.idLattes}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/me')}
            className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-primary px-6 py-2 text-sm font-medium text-white shadow hover:bg-primary/90 disabled:opacity-60"
          >
            {saving ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
}
