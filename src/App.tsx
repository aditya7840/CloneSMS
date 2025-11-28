import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './ComponentNavbar';
import { Home } from './pages/Home';
import { CategoryPage } from './pages/CategoryPage';
import { MyList } from './pages/MyList';

function AppRoutes() {
  return (
    <div className="min-h-screen bg-background text-white font-sans overflow-x-hidden selection:bg-primary selection:text-white">
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/my-list" element={<MyList />} />
      </Routes>

      <footer className="py-12 px-4 md:px-12 border-t border-gray-800 text-gray-500 text-sm">
        <p>&copy; 2024 SceneFlix. Built for education.</p>
      </footer>
    </div>
  );
}

export default AppRoutes;
