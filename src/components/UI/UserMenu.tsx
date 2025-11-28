import React from 'react';
import { LogOut, User, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const UserMenu = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-violet-600 flex items-center justify-center text-white font-bold hover:shadow-lg transition-all"
      >
        {(user.full_name || user.email || 'U').charAt(0).toUpperCase()}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-white/10 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-sm text-gray-400">Signed in as</p>
            <p className="font-semibold text-white truncate">{user.email}</p>
          </div>

          <button
            onClick={() => {
              navigate('/profile');
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/5 transition-all"
          >
            <User className="w-4 h-4" />
            My Profile
          </button>

          <button
            onClick={() => {
              navigate('/my-list');
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/5 transition-all"
          >
            <Bookmark className="w-4 h-4" />
            My Bookings
          </button>

          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 transition-all border-t border-white/10"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};
