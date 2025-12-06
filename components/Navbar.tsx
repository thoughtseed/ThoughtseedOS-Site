import React, { useState } from 'react';
import { Menu, X, Sun, Moon, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
  isMuted: boolean;
  toggleSound: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isDark, toggleTheme, isMuted, toggleSound }) => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const navItems = ['Work', 'Services', 'Philosophy', 'Contact'];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-cosmic-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10 px-4 py-4 md:px-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div
            className="text-2xl font-black uppercase tracking-tighter cursor-pointer select-none font-sans flex items-center gap-2"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            {/* <img src="/assets/screenshots/tslogo.png" alt="Thoughtseed" className="w-8 h-8 object-contain" /> */}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neo-lime via-white to-neo-lime bg-[length:200%_auto] animate-text drop-shadow-[0_0_8px_rgba(204,255,0,0.6)]">
              Thoughtseed
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item.toLowerCase())}
                className="font-mono font-bold uppercase text-xs tracking-widest text-neo-black dark:text-gray-300 hover:text-neo-pink transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neo-lime transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}

            <div className="h-6 w-[1px] bg-gray-300 dark:bg-white/20"></div>

            <div className="flex gap-2">
              <button
                onClick={toggleSound}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-neo-black dark:text-white transition-all"
                title={isMuted ? "Unmute Sound" : "Mute Sound"}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>


            </div>

            <button className="bg-neo-black dark:bg-white text-white dark:text-black px-6 py-2 font-bold uppercase text-sm hover:bg-neo-lime hover:text-black dark:hover:bg-neo-lime dark:hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none">
              Let's Talk
            </button>
          </div>

          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={toggleSound}
              className="p-2 text-neo-black dark:text-white"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 text-neo-black dark:text-white"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              className="p-2 text-neo-black dark:text-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[72px] left-0 w-full h-screen bg-white dark:bg-cosmic-dark z-40 md:hidden p-4"
          >
            <div className="flex flex-col gap-6 mt-8">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase())}
                  className="text-left font-black uppercase text-4xl text-transparent bg-clip-text bg-gradient-to-r from-neo-black to-gray-500 dark:from-white dark:to-gray-500 hover:to-neo-lime transition-all"
                >
                  {item}
                </button>
              ))}
              <button className="bg-neo-black dark:bg-white text-white dark:text-black px-6 py-4 font-bold uppercase w-full mt-8">
                Start a Project
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;