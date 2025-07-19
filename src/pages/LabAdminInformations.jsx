import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Pencil, Save, X, Upload } from "lucide-react";
import Gradients from "../utils/Gradient";
import { LAB_GRADIENTS, FALLBACK_GRADIENT } from "../constants/gradients";
import { updateLabInfo, uploadLabLogo } from "../services/LabService";

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';

function resolveLogo(raw) {
  if (!raw) return '';
  if (raw.includes('://')) return raw;
  return `${API_BASE}/api/files/download/${raw}`;
}

export default function LabAdminInformations() {
  const { labId, lab, setLab } = useOutletContext();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [preview, setPreview] = useState(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoError, setLogoError] = useState(null);
  const [logoSuccess, setLogoSuccess] = useState(false);

  useEffect(() => {
    if (editing && lab) {
      setForm({
        nome: lab.nome || "",
        descricao_curta: lab.descricaoCurta ?? lab.descricao_curta ?? "",
        descricao_longa: lab.descricaoLonga ?? lab.descricao_longa ?? "",
        foto_url: lab.logoUrl ?? lab.foto_url ?? "",
        gradientAccent: lab.gradientAccent || "GREEN",
      });
      setPreview(lab.logoUrl ?? lab.foto_url ?? "");
      setError(null);
      setSuccess(false);
    }
  }, [editing, lab]);

  if (!lab) return <p className="p-8">Carregando…</p>;
  if (!editing) {
    const bannerClass =
      LAB_GRADIENTS[lab.gradientAccent] ||
      lab.bannerGradientClass ||
      FALLBACK_GRADIENT;

    const shortDesc = lab.descricaoCurta ?? lab.descricao_curta;
    const longDesc = lab.descricaoLonga ?? lab.descricao_longa;

    return (
      <div className="space-y-8">
        <div
          className={`relative h-36 rounded-xl bg-gradient-to-r ${bannerClass} ring-1 ring-gray-300 shadow-sm`}
        >
          {(lab.logoUrl || lab.foto_url) && (
            <img
              src={lab.logoUrl || lab.foto_url}
              alt="logo"
              className="absolute -bottom-7 left-6 h-24 w-24 rounded-full border-4 border-white object-cover shadow-md"
              draggable={false}
            />
          )}
          <h2 className="absolute bottom-4 right-6 text-2xl font-semibold text-white drop-shadow-sm">
            {lab.nome}
          </h2>
        </div>

        <article className="mx-auto max-w-3xl space-y-4 text-gray-700">
          {shortDesc && <p className="text-lg font-medium">{shortDesc}</p>}
          {longDesc && <p className="whitespace-pre-line">{longDesc}</p>}
          {!shortDesc && !longDesc && (
            <p className="text-sm text-gray-500">
              Nenhuma descrição cadastrada.
            </p>
          )}
        </article>

        <div className="flex justify-end">
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1 rounded bg-primary px-4 py-2 text-sm font-medium text-white shadow hover:bg-primary/90"
          >
            <Pencil className="h-4 w-4" /> Editar informações
          </button>
        </div>
      </div>
    );
  }

  if (!form) return <p className="p-8">Preparando edição…</p>;

  const isValid =
    form.nome.trim() &&
    form.descricao_curta.trim() &&
    form.descricao_longa.trim() &&
    form.gradientAccent;

  async function handleSave() {
    if (!isValid || saving) return;
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const updated = await updateLabInfo(labId, {
        nome: form.nome,
        descricaoCurta: form.descricao_curta,
        descricaoLonga: form.descricao_longa,
        gradientAccent: form.gradientAccent,
      });
      const normalizedLogo = resolveLogo(updated.logoUrl || updated.logo_url || lab.logoUrl);

      setLab(prev => ({ ...prev, ...updated, logoUrl: normalizedLogo }));
      setSuccess(true);
      setEditing(false);
    } catch (err) {
      if (err.response?.status === 403) {
        setError("Você não tem permissão para alterar este laboratório.");
      } else if (err.response?.status === 404) {
        setError("Laboratório não encontrado.");
      } else if (err.message === "Campos obrigatórios vazios.") {
        setError("Preencha todos os campos obrigatórios.");
      } else {
        setError("Falha ao salvar. Tente novamente.");
      }
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoError(null);
    setLogoSuccess(false);

    const previous = preview;
    const temp = URL.createObjectURL(file);
    setPreview(temp);

    setUploadingLogo(true);
    try {
      const result = await uploadLabLogo(labId, file);
      const finalUrl = result.url
        ? result.url
        : resolveLogo(result.fileName);

      setForm(f => ({ ...f, foto_url: finalUrl }));
      setLab(prev => ({ ...prev, logoUrl: finalUrl }));
      setLogoSuccess(true);
      setTimeout(() => setLogoSuccess(false), 2500);
    } catch (err) {
      console.error(err);
      setPreview(previous);
      if (err.response?.status === 403) {
        setLogoError("Sem permissão para enviar a logo.");
      } else if (err.response?.status === 404) {
        setLogoError("Laboratório não encontrado.");
      } else {
        setLogoError("Falha no upload da imagem.");
      }
    } finally {
      setUploadingLogo(false);
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
      className="space-y-8 rounded-xl bg-gray-50 p-6 ring-1 ring-gray-200"
    >
      <section className="space-y-4">
        <label className="text-sm font-medium">Nome do laboratório</label>
        <input
          className="mt-1 w-full rounded border border-gray-300 p-2 focus:border-primary focus:outline-none"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          required
        />

        <label className="text-sm font-medium">Cor do banner</label>
        <Gradients
          value={form.gradientAccent}
          onChange={(g) => setForm({ ...form, gradientAccent: g })}
        />
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Descrição curta</label>
          <textarea
            rows={3}
            className="w-full resize-none rounded border border-gray-300 p-2 focus:border-primary focus:outline-none"
            value={form.descricao_curta}
            onChange={(e) =>
              setForm({ ...form, descricao_curta: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Descrição longa</label>
          <textarea
            rows={5}
            className="w-full resize-none rounded border border-gray-300 p-2 focus:border-primary focus:outline-none"
            value={form.descricao_longa}
            onChange={(e) =>
              setForm({ ...form, descricao_longa: e.target.value })
            }
            required
          />
        </div>
      </section>

      <section className="space-y-3">
        <label className="text-sm font-medium">Logo</label>
        <div className="flex flex-wrap items-center gap-4">
          <div className="h-24 w-24 overflow-hidden rounded-full ring-2 ring-gray-300 bg-white">
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="h-full w-full object-cover"
                draggable={false}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                sem logo
              </div>
            )}
          </div>

            <div className="flex flex-col gap-2">
            <label className="inline-flex cursor-pointer items-center gap-1 rounded bg-primary px-3 py-2 text-sm font-medium text-white shadow hover:bg-primary/90">
              <Upload className="h-4 w-4" />
              {uploadingLogo ? "Enviando..." : "Trocar logo"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFile}
                disabled={uploadingLogo}
              />
            </label>

            {logoError && (
              <p className="text-xs text-red-600">{logoError}</p>
            )}
            {logoSuccess && (
              <p className="text-xs text-green-600">Logo atualizada!</p>
            )}
            <p className="text-[11px] text-gray-500">
              A imagem é salva imediatamente ao selecionar (as demais
              alterações precisam do botão *Salvar*).
            </p>
          </div>
        </div>
      </section>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && (
        <p className="text-sm text-green-600">
          Informações do laboratório atualizadas!
        </p>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={!isValid || saving}
          className="flex items-center gap-1 rounded bg-primary px-5 py-2 text-sm font-medium text-white shadow disabled:opacity-50 hover:bg-primary/90"
        >
          {saving ? "Salvando…" : <>
            <Save className="h-4 w-4" /> Salvar
          </>}
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          disabled={saving}
          className="flex items-center gap-1 rounded bg-gray-200 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
        >
          <X className="h-4 w-4" /> Cancelar
        </button>
      </div>
    </form>
  );
}
