import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-full hover:bg-bg-subtle transition-colors focus:outline-none focus:ring-2 focus:ring-primary overflow-hidden"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-5 h-5">
        <motion.div
          initial={false}
          animate={{
            scale: theme === 'dark' ? 1 : 0,
            opacity: theme === 'dark' ? 1 : 0,
            rotate: theme === 'dark' ? 0 : 90
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          className="absolute inset-0 text-secondary"
        >
          <Moon size={20} />
        </motion.div>
        
        <motion.div
          initial={false}
          animate={{
            scale: theme === 'light' ? 1 : 0,
            opacity: theme === 'light' ? 1 : 0,
            rotate: theme === 'light' ? 0 : -90
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          className="absolute inset-0 text-secondary"
        >
          <Sun size={20} />
        </motion.div>
      </div>
    </button>
  );
};

export default ThemeToggle;
