import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell } from 'lucide-react';
import { cn } from './Utils';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

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
        <Link to="/my-list" className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center font-bold hover:bg-blue-700 transition-colors">
            S
          </div>
        </Link>
      </div>
    </nav>
  );
};