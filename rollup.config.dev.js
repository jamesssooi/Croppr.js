import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import cleanup from 'rollup-plugin-cleanup';

const banner = `/**
 * Croppr.js
 * https://github.com/jamesssooi/Croppr.js
 * 
 * A JavaScript image cropper that's lightweight, awesome, and has
 * zero dependencies.
 * 
 * (C) 2018 James Ooi. Released under the MIT License.
 */
`;

export default {
  entry: 'src/index.js',
  plugins: [
    json(),
    babel(),
    cleanup({
      comments: 'jsdoc'
    })
  ],
  format: 'umd',
  moduleName: 'Croppr',
  dest: 'build/croppr.js',
  banner: banner
};