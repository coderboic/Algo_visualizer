/**
 * Custom plugin to handle hsl variables and colors in Tailwind
 */
import plugin from 'tailwindcss/plugin';

export const shadcnUiPlugin = plugin(
  ({ addUtilities }) => {
    addUtilities({
      '.border-border': {
        borderColor: 'hsl(var(--border))',
      },
      '.bg-background': {
        backgroundColor: 'hsl(var(--background))',
      },
      '.text-foreground': {
        color: 'hsl(var(--foreground))',
      },
    });
  }
);
