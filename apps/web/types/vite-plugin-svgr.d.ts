declare module 'vite-plugin-svgr' {
  import type { PluginOption } from 'vite';

  interface VitePluginSvgrOptions {
    exportAsDefault?: boolean;
    svgrOptions?: Record<string, unknown>;
    esbuildOptions?: Record<string, unknown>;
  }

  export default function svgrPlugin(
    options?: VitePluginSvgrOptions,
  ): PluginOption;
}
