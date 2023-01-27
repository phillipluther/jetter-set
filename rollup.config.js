import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
    },
  ],
  plugins: [typescript(), terser(), filesize()],
};
