import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { resolveAsset } from '../../utils/resolveAsset';
import { getMeuPerfil } from '../../services/ProfileService';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User, Edit3 } from 'lucide-react';

export default function UserAvatarMenu({ displayName = '' }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [photoUrl, setPhotoUrl] = useState('');
  const [open, setOpen] = useState(false);
  const [loadingPhoto, setLoadingPhoto] = useState(true);

  const btnRef = useRef(null);
  const menuRef = useRef(null);

  // Carrega / cache da foto
  useEffect(() => {
    let cancel = false;
    setLoadingPhoto(true);

    // Tenta cache
    try {
      const cached = localStorage.getItem('__perfil_min');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.photoUrl) {
          setPhotoUrl(resolveAsset(parsed.photoUrl));
        }
      }
    } catch (_) {/* ignore */}

    getMeuPerfil()
      .then(data => {
        if (cancel) return;
        const finalUrl = resolveAsset(data.photoUrl);
        setPhotoUrl(finalUrl);
        localStorage.setItem(
          '__perfil_min',
          JSON.stringify({ photoUrl: data.photoUrl })
        );
      })
      .catch(() => {
        // fallback já está previsto
      })
      .finally(() => !cancel && setLoadingPhoto(false));

    return () => { cancel = true; };
  }, []);

  const initial =
    (displayName || '').trim().charAt(0).toUpperCase() || '?';

  // Clique fora fecha
  useEffect(() => {
    function handleClickOutside(e) {
      if (!open) return;
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    function handleKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  // Fecha ao navegar
  const go = useCallback(
    (path) => {
      setOpen(false);
      navigate(path);
    },
    [navigate]
  );

  function handleLogout() {
    setOpen(false);
    logout(); 
  }

  useEffect(() => {
    if (open && menuRef.current) {
      const first = menuRef.current.querySelector('button, a');
      first?.focus();
    }
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        className="group flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/40"
      >
        <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-white shadow bg-primary/20 flex items-center justify-center text-white font-semibold">
          {photoUrl && !loadingPhoto ? (
            <img
              src={photoUrl}
              alt={displayName}
              className="h-full w-full object-cover"
              onError={() => setPhotoUrl('')}
              draggable={false}
            />
          ) : (
            <span className="select-none text-base">{initial}</span>
          )}
        </div>
        <span className="hidden text-sm font-medium text-gray-700 md:inline">
          {displayName.split(' ')[0] || 'Você'}
        </span>
        <svg
          className={`hidden h-4 w-4 text-gray-500 transition md:inline ${
            open ? 'rotate-180' : ''
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          aria-label="Menu do usuário"
          className="absolute right-0 mt-2 w-48 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg focus:outline-none animate-fade-in"
        >
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="truncate text-sm font-medium text-gray-800">
              {displayName || 'Usuário'}
            </p>
          </div>

            <button
              type="button"
              onClick={() => go('/me')}
              role="menuitem"
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
            >
              <User className="h-4 w-4 text-gray-500" />
              Meu perfil
            </button>

            <button
              type="button"
              onClick={() => go('/me/editar')}
              role="menuitem"
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
            >
              <Edit3 className="h-4 w-4 text-gray-500" />
              Editar perfil
            </button>

            <button
              type="button"
              onClick={handleLogout}
              role="menuitem"
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 focus:bg-red-50 focus:outline-none"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
        </div>
      )}
    </div>
  );
}
