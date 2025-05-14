import React from 'react';
import { FaMoon, FaSun, FaUserCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Header = ({ user, darkMode, toggleDarkMode }) => {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 shadow-lg fixed top-0 left-0 w-full z-40 border-b border-gray-200 dark:border-gray-800"
      style={{ minHeight: 64 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo y nombre */}
        <div className="flex items-center gap-3">
          <img src="/logo192.png" alt="Logo" className="h-8 w-8 rounded-full shadow-md" />
          <span className="text-xl font-bold text-primary-700 dark:text-primary-300 tracking-tight">RENTING ALL</span>
        </div>
        {/* Acciones */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <FaSun className="text-yellow-400 text-lg" />
            ) : (
              <FaMoon className="text-gray-700 text-lg" />
            )}
          </button>
          <div className="flex items-center gap-2">
            <FaUserCircle className="text-2xl text-primary-600 dark:text-primary-300" />
            <span className="text-base font-medium text-gray-700 dark:text-gray-200">
              {user?.nombre || 'Usuario'}
            </span>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header; 