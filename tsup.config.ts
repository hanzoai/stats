import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    'index': 'src/index.ts',
    'db/index': 'src/db/index.ts',
    'charts/index': 'src/charts/index.ts',
    'providers/index': 'src/providers/index.ts',
    'hooks/index': 'src/hooks/index.ts',
    'components/index': 'src/components/index.tsx'
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'recharts', 'sql.js'],
  treeshake: true,
  minify: false,
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";'
    }
  }
})
