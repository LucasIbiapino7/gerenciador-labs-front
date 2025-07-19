const API_BASE = import.meta.env.VITE_API_URL || '';

export function buildFileUrl(fileName) {
  if (!fileName) return '';
  // Já é uma URL completa?
  if (/^https?:\/\//i.test(fileName)) return fileName;
  // Já vem começando pelo caminho de download?
  if (fileName.startsWith('/api/files/download/')) {
    return API_BASE
      ? API_BASE.replace(/\/$/, '') + fileName
      : fileName;
  }
  // Caso comum: só o nome do arquivo
  return `${API_BASE.replace(/\/$/, '')}/api/files/download/${fileName}`;
}
