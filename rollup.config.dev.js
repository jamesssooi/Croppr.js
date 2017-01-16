import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

var banner = `/**
 * Croppr.js
 * https://github.com/jamesssooi/Croppr.js
 * 
 * A JavaScript image cropper that's lightweight, awesome, and has
 * zero dependencies.
 * 
 * (C) 2017 James Ooi. Released under the MIT License.
 */
`

export default {
  entry: 'src/main.js',
  plugins: [ json(), babel() ],
  format: 'umd',
  moduleName: 'Croppr',
  dest: 'dist/croppr.js',
  banner: banner
};