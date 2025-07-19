import { useState, useEffect } from 'react';

export default function CreateLabModal({ open, onClose, onCreate }) {
  const [form, setForm] = useState({ nome: '', descricaoCurta: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      setForm({ nome: '', descricaoCurta: '' });
      setSaving(false);
    }
  }, [open]);

  if (!open) return null;

  const canSave = form.nome.trim().length >= 3 && !saving;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSave) return;
    setSaving(true);
    await onCreate({
      nome: form.nome.trim(),
      descricaoCurta: form.descricaoCurta.trim()
    });
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Novo Laboratório
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Nome *
            </label>
            <input
              autoFocus
              type="text"
              value={form.nome}
              onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              placeholder="Ex.: Laboratório de Visão Computacional"
            />
            <p className="mt-1 text-[11px] text-gray-400">
              Mínimo 3 caracteres.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Descrição Curta
            </label>
            <textarea
              rows={3}
              value={form.descricaoCurta}
              onChange={e =>
                setForm(f => ({ ...f, descricaoCurta: e.target.value }))
              }
              className="w-full resize-none rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              placeholder="Resumo rápido do foco do laboratório..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!canSave}
              className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-white disabled:opacity-50 hover:bg-primary/90"
            >
              {saving ? 'Salvando…' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}