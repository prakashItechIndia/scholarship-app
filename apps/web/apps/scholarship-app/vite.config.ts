import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import svgr from 'vite-plugin-svgr';
import { statSync } from 'fs';

// Helper to find node_modules
function findNodeModules(startPath: string): string | null {
  let currentPath = startPath;
  while (currentPath !== path.dirname(currentPath)) {
    const nodeModulesPath = path.join(currentPath, 'node_modules');
    try {
      if (statSync(nodeModulesPath).isDirectory()) {
        return nodeModulesPath;
      }
    } catch {
      // Continue searching
    }
    currentPath = path.dirname(currentPath);
  }
  return null;
}

// https://vite.dev/config/
export default defineConfig(() => {
  const appNodeModules = findNodeModules(__dirname) || path.resolve(__dirname, './node_modules');
  
  return {
    plugins: [
      react(),
      svgr({
        // svgr options: https://react-svgr.com/docs/options/
        svgrOptions: {
          // ...
        },

        // esbuild options, to transform jsx to js
        esbuildOptions: {
          // ...
        },

        // A minimatch pattern, or array of patterns, which specifies the files in the build the plugin should include.
        include: '**/*.svg?react',

        //  A minimatch pattern, or array of patterns, which specifies the files in the build the plugin should ignore. By default no files are ignored.
        exclude: '',
      }),
    ],
    server: { port: process.env.PORT ? parseInt(process.env.PORT) : 5173 },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@shared': path.resolve(__dirname, '../../packages/shared/src'),
        '@ui': path.resolve(__dirname, '../../../../packages/ui'),
        // Ensure react-hook-form is resolved from this app's node_modules
        'react-hook-form': path.resolve(appNodeModules, 'react-hook-form'),
      },
      preserveSymlinks: false,
      dedupe: ['react', 'react-dom', 'react-hook-form'],
    },
    optimizeDeps: {
      include: ['react-hook-form'],
      esbuildOptions: {
        resolveExtensions: ['.tsx', '.ts', '.jsx', '.js'],
      },
    },
    build: {
      minify: 'esbuild' as const,
      cssMinify: true,
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'query-vendor': ['@tanstack/react-query'],
            'ui-vendor': ['@fluentui/react', '@fluentui/react-icons'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
    esbuild: {
      drop:
        process.env.NODE_ENV === 'production'
          ? (['console', 'debugger'] as ('console' | 'debugger')[])
          : [],
    },
  };
});
