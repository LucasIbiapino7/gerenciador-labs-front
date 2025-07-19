import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import UserAvatarMenu from './UserAvatarMenu';

export default function Header() {
  const { isAuthenticated, login, user, isSuperAdmin } = useAuth();

  const displayName =
    user?.profile?.name ||
    user?.profile?.preferred_username ||
    user?.profile?.email ||
    '';

  return (
    <header className="sticky top-0 z-20 h-16 w-full bg-white shadow-sm">
      <div className="flex h-full items-center justify-between px-6 md:px-12">
        <Link
          to={isAuthenticated ? '/labs' : '/'}
          className="flex items-center gap-2"
        >
          <span className="text-lg font-semibold text-primary">
            Portal de Laboratórios
          </span>
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            {isSuperAdmin && (
              <Link
                to="/admin"
                className="rounded-md border border-primary px-3 py-1.5 text-sm font-medium text-primary transition hover:bg-primary/5"
              >
                Admin
              </Link>
            )}
            <UserAvatarMenu displayName={displayName} />
          </div>
        ) : (
          <button
            onClick={login}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
          >
            Entrar
          </button>
        )}
      </div>
    </header>
  );
}
