import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  
  // Actions
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// Helper function to get system theme preference
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Helper function to apply theme to document
const applyTheme = (theme: 'light' | 'dark') => {
  if (typeof window === 'undefined') return;
  
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
  
  // Update meta theme-color for mobile browsers
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#ffffff');
  }
};

// Helper function to resolve theme
const resolveTheme = (theme: Theme): 'light' | 'dark' => {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: 'light',

      setTheme: (theme: Theme) => {
        const resolvedTheme = resolveTheme(theme);
        applyTheme(resolvedTheme);
        set({ theme, resolvedTheme });
      },

      toggleTheme: () => {
        const { theme, resolvedTheme } = get();
        
        // If current theme is system, toggle based on resolved theme
        if (theme === 'system') {
          const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
          get().setTheme(newTheme);
        } else {
          // Toggle between light and dark
          const newTheme = theme === 'light' ? 'dark' : 'light';
          get().setTheme(newTheme);
        }
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        // Initialize theme on hydration
        if (state) {
          const resolvedTheme = resolveTheme(state.theme);
          state.resolvedTheme = resolvedTheme;
          applyTheme(resolvedTheme);

          // Listen for system theme changes
          if (typeof window !== 'undefined' && state.theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => {
              if (state.theme === 'system') {
                const newResolvedTheme = getSystemTheme();
                state.resolvedTheme = newResolvedTheme;
                applyTheme(newResolvedTheme);
              }
            };

            mediaQuery.addEventListener('change', handleChange);
            
            // Cleanup function (though it won't be called in this context)
            return () => mediaQuery.removeEventListener('change', handleChange);
          }
        }
      },
    }
  )
);

// Initialize theme on module load
if (typeof window !== 'undefined') {
  // Set initial theme
  const initialTheme = resolveTheme('system');
  applyTheme(initialTheme);
  
  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleSystemThemeChange = () => {
    const state = useThemeStore.getState();
    if (state.theme === 'system') {
      const newResolvedTheme = getSystemTheme();
      useThemeStore.setState({ resolvedTheme: newResolvedTheme });
      applyTheme(newResolvedTheme);
    }
  };

  mediaQuery.addEventListener('change', handleSystemThemeChange);
}









