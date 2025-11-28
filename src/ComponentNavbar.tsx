import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell } from 'lucide-react';
import { cn } from './Utils';
import { useAuth } from './hooks/useAuth';
import { UserMenu } from './components/UI/UserMenu';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-colors duration-500 ease-in-out px-4 md:px-12 py-4 flex items-center justify-between",
      isScrolled ? "bg-background/95 backdrop-blur-sm shadow-xl" : "bg-transparent bg-gradient-to-b from-black/80 to-transparent"
    )}>
      <Link to="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
        <h1 className="text-3xl font-black text-primary tracking-tighter">
          SCENE<span className="text-white font-light">FLIX</span>
        </h1>
      </Link>
      
      <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <Link to="/category/concerts" className="hover:text-white transition-colors">Concerts</Link>
        <Link to="/category/comedy" className="hover:text-white transition-colors">Comedy</Link>
        <Link to="/my-list" className="hover:text-white transition-colors">My List</Link>
      </div>

      <div className="flex items-center gap-6 text-white">
        <Search className="w-5 h-5 cursor-pointer hover:text-gray-300 transition-colors" />
        <Bell className="w-5 h-5 cursor-pointer hover:text-gray-300 transition-colors" />
        {user ? (
          <UserMenu />
        ) : (
          <Link to="/login" className="flex items-center gap-2 cursor-pointer">
            <div className="px-4 py-2 rounded bg-gradient-to-r from-pink-600 to-violet-600 font-bold hover:shadow-lg transition-all text-sm">
              Login
            </div>
          </Link>
        )}
      </div>
    </nav>
  );
};