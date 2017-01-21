import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

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
  entry: 'src/index.js',
  plugins: [ json(), babel(), uglify() ],
  format: 'umd',
  moduleName: 'Croppr',
  dest: 'dist/croppr.min.js',
  banner: banner
};r