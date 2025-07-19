import { Dialog } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { X, Save } from 'lucide-react';

export default function EventModal({ open, onClose, onSave, initial, error }) {
  const safeInitial = {
    id: initial?.id,
    titulo: initial?.titulo || '',
    descricao: initial?.descricao || '',
    data: initial?.data || '',
    hora: initial?.hora || '',
    local: initial?.local || '',
  };

  const [form, setForm] = useState(safeInitial);

  useEffect(() => {
    if (open) {
      setForm({
        id: initial?.id,
        titulo: initial?.titulo || '',
        descricao: initial?.descricao || '',
        data: initial?.data || '',
        hora: initial?.hora || '',
        local: initial?.local || '',
      });
    }
  }, [open, initial]);

  if (!open) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  const isValid =
    form.titulo.trim() &&
    form.descricao.trim() &&
    form.data &&
    form.hora &&
    form.local.trim();

  function handleSave() {
    if (!isValid) return;
    const dataEvento = `${form.data}T${form.hora}:00`;
    onSave({
      id: form.id,
      titulo: form.titulo.trim(),
      descricao: form.descricao.trim(),
      local: form.local.trim(),
      dataEvento,
    });
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="fixed inset-0 z-50 grid place-items-center"
    >
      <div className="fixed inset-0 bg-black/50" />

      <div className="z-10 w-full max-w-lg space-y-6 rounded-xl bg-white p-6">
        <header className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {form.id ? 'Editar evento' : 'Novo evento'}
          </h3>
          <button onClick={onClose} type="button">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </header>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <input
          name="titulo"
          value={form.titulo}
          onChange={handleChange}
          placeholder="Título"
          className="w-full rounded border p-2 text-sm focus:border-primary focus:outline-none"
        />

        <textarea
          name="descricao"
          value={form.descricao}
          onChange={handleChange}
          placeholder="Descrição"
          rows={3}
          className="w-full resize-none rounded border p-2 text-sm focus:border-primary focus:outline-none"
        />

        <div className="flex gap-3">
            <input
              type="date"
              name="data"
              value={form.data}
              onChange={handleChange}
              className="flex-1 rounded border p-2 text-sm focus:border-primary focus:outline-none"
            />
            <input
              type="time"
              name="hora"
              value={form.hora}
              onChange={handleChange}
              className="flex-1 rounded border p-2 text-sm focus:border-primary focus:outline-none"
            />
        </div>

        <input
          name="local"
          value={form.local}
          onChange={handleChange}
          placeholder="Local"
          className="w-full rounded border p-2 text-sm focus:border-primary focus:outline-none"
        />

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={!isValid}
            className="flex items-center gap-1 rounded bg-primary px-4 py-1.5 text-sm font-medium text-white disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            Salvar
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-gray-200 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-300"
          >
            Cancelar
          </button>
        </div>
      </div>
    </Dialog>
  );
}
