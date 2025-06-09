import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import { useAuth } from '../../contexts/AuthContext';

function Header() {
  const { isAuthenticated, login, user } = useAuth();

  return (
    <header className="sticky top-0 z-20 h-16 w-full bg-white shadow-sm">
      <div className="flex h-full items-center justify-between px-12">
        <Link
          to={isAuthenticated ? '/labs' : '/'}
          className="flex items-center gap-2"
        >
          <span className="text-lg font-semibold text-primary">
            Portal de Laboratórios
          </span>
        </Link>
        {isAuthenticated ? (
          <Avatar 
            displayName={user?.profile?.name || user?.profile?.preferred_username}
          />
        ) : (
          <button
            onClick={login}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition"
          >
            Entrar
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;