import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
{{#with typescript}}
import typescript from 'rollup-plugin-typescript'
{{/with}}
import sourceMaps from 'rollup-plugin-sourcemaps'
import { terser } from 'rollup-plugin-terser'

const createConfig = ({ output }) => {
    const plugins = [
        resolve(),
        {{#with typescript}}
        typescript(),
        {{/with}}
        sourceMaps(),
        terser({
            output: {
                comments: function (node, comment) {
                    var text = comment.value;
                    var type = comment.type;
                    if (type == "comment2") {
                        // multiline comment
                        return /@preserve|@license|@cc_on/i.test(text);
                    }
                },
            },
        })
    ]

    if (output.format !== 'esm') plugins.push(commonjs())

    return {
        input: 'src/index.ts',
        output: {
            ...output,
            name: 'bundle',
            sourcemap: true
        },
        plugins
    }
}

export default [
    createConfig({
        output: {
            file: pkg.main,
            format: 'cjs'
        }
    }),
    createConfig({
        output: {
            file: pkg.module,
            format: 'esm'
        }
    }),
    createConfig({
        output: {
            file: pkg.browser,
            format: 'umd'
        }
    }),
    createConfig({
        output: {
            file: pkg.iife,
            format: 'iife',
            extend: true
        }
    })
]