/** @format */

import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import cleanup from 'rollup-plugin-cleanup';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import pkg from '../package.json' assert { type: 'json' };
import terser from '@rollup/plugin-terser';

const bundle = (config) => ({
    input: './src/index.ts',
    external: (id) => !/^[./]/.test(id),
    ...config,
});

export default [
    bundle({
        plugins: [commonjs(), resolve(), esbuild(), cleanup({ extensions: ['ts'] })],
        output: [
            {
                file: pkg.main,
                format: 'cjs',
                sourcemap: true,
            },
            {
                file: pkg.module,
                format: 'es',
                sourcemap: true,
            },
            /**
             * The IIFE bundle is used for delivery via unpgk CDN and as the browser package file. It will work in any
             * browser, even if it doesn't support ESM Modules, imports or exports.
             */
            {
                file: pkg.unpkg,
                format: 'iife',
                sourcemap: true,
                plugins: [terser()],
                name: 'nord',
            },
        ],
    }),
    bundle({
        output: {
            file: pkg.types,
            format: 'es',
        },
        plugins: [resolve(), commonjs(), cleanup({ extensions: ['.ts'] }), dts()],
    }),
];
