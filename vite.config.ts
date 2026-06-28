import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load all env vars (no prefix filter) from .env files + process.env.
  const env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };

  // The Supabase integration exposes NEXT_PUBLIC_*/SUPABASE_* names, but this
  // Vite app reads VITE_SUPABASE_* . Map them so the client connects with no
  // extra setup, while still honoring an explicit VITE_* override if present.
  const supabaseUrl =
    env.VITE_SUPABASE_URL ||
    env.NEXT_PUBLIC_SUPABASE_URL ||
    env.SUPABASE_URL ||
    '';
  const supabaseAnonKey =
    env.VITE_SUPABASE_ANON_KEY ||
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    env.SUPABASE_ANON_KEY ||
    '';
  const geminiApiKey = env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || '';

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseAnonKey),
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(geminiApiKey),
    },
    server: {
      host: true,
      port: 5173,
      allowedHosts: true,
    },
  };
});

