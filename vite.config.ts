import { defineConfig } from 'vitest/config';
import path from 'path';
import legacy from '@vitejs/plugin-legacy';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [
        tsconfigPaths(),
        legacy({
            targets: ['chrome >= 55'],
            polyfills: true,
            modernPolyfills: true,
        }),
    ],
    resolve: {
        alias: {
            '@theme': path.resolve(__dirname, 'src/theme'),
        },
    },
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
                paths: [path.resolve(__dirname, 'src')],
                alias: {
                    '@theme': path.resolve(__dirname, 'src/theme'),
                },
            },
        },
        modules: {
            localsConvention: 'camelCaseOnly',
        },
    },
    test: {
        globals: true,
        setupFiles: './src/test/setup.ts',
        environment: 'happy-dom',
        css: {
            modules: {
                classNameStrategy: 'non-scoped',
            },
        },
    },
});
