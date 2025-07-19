import { useState, useEffect } from 'react';

export default function MaterialModal({
  open,
  onClose,
  onSave,
  initialData,
  error,
}) {
  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    url: '',
    tipo: 'pdf',
    visibilidade: 'PUBLICO',
  });

  useEffect(() => {
    if (initialData) setForm(initialData);
    else
      setForm({
        titulo: '',
        descricao: '',
        url: '',
        tipo: 'pdf',
        visibilidade: 'PUBLICO',
      });
  }, [initialData, open]);

  if (!open) return null;

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, id: initialData?.id });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold">
          {initialData ? 'Editar material' : 'Novo material'}
        </h2>
        {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Título</label>
            <input
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              required
              className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Descrição</label>
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              rows={3}
              className="w-full resize-none rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">URL</label>
            <input
              name="url"
              value={form.url}
              onChange={handleChange}
              required
              type="url"
              className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Tipo</label>
              <select
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-primary"
              >
                <option value="pdf">PDF</option>
                <option value="slide">Slides</option>
                <option value="video">Vídeo</option>
                <option value="repositorio">Repositório</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Visibilidade
              </label>
              <select
                name="visibilidade"
                value={form.visibilidade}
                onChange={handleChange}
                className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-primary"
              >
                <option value="PUBLICO">Público</option>
                <option value="PRIVADO">Privado</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-gray-300 px-4 py-1.5 text-sm hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded bg-primary px-5 py-1.5 text-sm font-medium text-white hover:bg-primary/90"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
