import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import typescript from 'rollup-plugin-typescript';

const banner = `/**
 * Croppr.js
 * https://github.com/jamesssooi/Croppr.js
 * 
 * A JavaScript image cropper that's lightweight, awesome, and has
 * zero dependencies.
 * 
 * (C) 2018 James Ooi. Released under the MIT License.
 */
`

// TODO: Multiple bundles (minifed and unminified)
export default {
  entry: 'src/croppr.ts',
  plugins: [ json(), typescript(), babel(), uglify() ],
  format: 'umd',
  moduleName: 'Croppr',
  dest: 'dist/croppr.min.js',
  banner: banner
};
