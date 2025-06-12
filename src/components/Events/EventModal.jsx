import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import { X, Save } from 'lucide-react';

export default function EventModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState(
    initial || { titulo: '', data: '', hora: '', local: '', conteudo: '' }
  );

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50 grid place-items-center">
      <div className="fixed inset-0 bg-black/50" />

      <div className="z-10 w-full max-w-lg space-y-6 rounded-xl bg-white p-6">
        <header className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {initial ? 'Editar evento' : 'Novo evento'}
          </h3>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </header>
        <input
          className="w-full rounded border p-2 text-sm"
          placeholder="Título"
          value={form.titulo}
          onChange={(e) => setForm({ ...form, titulo: e.target.value })}
        />
        <div className="flex gap-3">
          <input
            type="date"
            className="flex-1 rounded border p-2 text-sm"
            value={form.data}
            onChange={(e) => setForm({ ...form, data: e.target.value })}
          />
          <input
            type="time"
            className="flex-1 rounded border p-2 text-sm"
            value={form.hora}
            onChange={(e) => setForm({ ...form, hora: e.target.value })}
          />
        </div>
        <input
          className="w-full rounded border p-2 text-sm"
          placeholder="Local"
          value={form.local}
          onChange={(e) => setForm({ ...form, local: e.target.value })}
        />
        <textarea
          rows={3}
          className="w-full rounded border p-2 text-sm"
          placeholder="Descrição"
          value={form.conteudo}
          onChange={(e) => setForm({ ...form, conteudo: e.target.value })}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={() => onSave(form)}
            className="flex items-center gap-1 rounded bg-primary px-4 py-1.5 text-sm font-medium text-white"
          >
            <Save className="h-4 w-4" /> Salvar
          </button>
          <button
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
