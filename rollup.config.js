import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-js2';


export default {
    'entry': 'index.js',
    'format': 'cjs',
    'dest': 'build/substrate-graph.js',
    'indent': true,
    plugins: [
        uglify( {}, minify )
    ]
};
