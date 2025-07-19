export function resolveAsset(path) {
  if (!path) return '';
  if (path.includes('://') || path.startsWith('data:')) return path;
  const base = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
  return `${base}/api/files/download/${path}`;
}
