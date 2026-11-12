import react from '@vitejs/plugin-react';
import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vite';

// The site is compiled with Astryx from source, the same wiring the
// cairn-gui web preview uses: the build plugin runs the StyleX compiler
// over the library and this site's own Astryx surface, and
// `@astryxdesign/core` is aliased to the package's src so subpath imports
// resolve to source files. `@astryxdesign/build` is ESM only while this
// package is CommonJS, so the plugin is loaded with a dynamic import
// inside the async config.
export default defineConfig(async () => {
  const {astryxStylex} = await import('@astryxdesign/build/vite');
  return {
    plugins: [
      ...astryxStylex({
        stylexOptions: {
          dev: process.env.NODE_ENV === 'development',
          runtimeInjection: false,
          propertyValidationMode: 'throw',
          treeshakeCompensation: true,
          unstable_moduleResolution: {
            type: 'commonJS',
            rootDir: fileURLToPath(new URL('.', import.meta.url)),
          },
        },
      }),
      react(),
    ],
    resolve: {
      alias: [
        {
          find: '@astryxdesign/core',
          replacement: fileURLToPath(
            new URL('./node_modules/@astryxdesign/core/src', import.meta.url),
          ),
        },
      ],
    },
    optimizeDeps: {
      exclude: ['@astryxdesign/core'],
    },
    server: {host: '127.0.0.1', port: 5173},
  };
});
