import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import esbuild from 'rollup-plugin-esbuild';

const external = ['os', 'tty', 'stream', 'http', 'https', 'url', 'zlib'];

export default [
  // CLI
  {
    input: 'src/index.js',
    output: {
      file: 'dist/bundle.min.cjs',
      format: 'cjs',
      banner: '#!/usr/bin/env node',
    },
    external,
    plugins: [
      nodeResolve({ preferBuiltins: true }),
      commonjs(),
      json(),
      esbuild({ target: 'es2020', minify: true }),
    ],
  },
  // ESM
  {
    input: 'src/main.js',
    output: {
      file: 'dist/main.js',
      format: 'esm',
    },
    external,
    plugins: [
      nodeResolve({ preferBuiltins: true }),
      commonjs(),
      json(),
      esbuild({ target: 'es2020', minify: true }),
    ],
  },
  // CJS
  {
    input: 'src/main.js',
    output: {
      file: 'dist/main.cjs',
      format: 'cjs',
      exports: 'default',
    },
    external,
    plugins: [
      nodeResolve({ preferBuiltins: true }),
      commonjs(),
      json(),
      esbuild({ target: 'es2020', minify: true }),
    ],
  },
];
