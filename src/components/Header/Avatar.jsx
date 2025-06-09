import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

function Avatar({ displayName }) {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="block h-10 w-10 rounded-full border border-gray-300"
      >
        <img
          src="https://i.pravatar.cc/40"
          alt={displayName || 'avatar'}
          className="h-full w-full rounded-full object-cover"
        />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-md bg-white py-1 shadow-lg">
          <button
            onClick={logout}
            className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
}

export default Avatar;
