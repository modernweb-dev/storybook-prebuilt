/* eslint-disable no-param-reassign, import/no-dynamic-require, global-require */
import cjsModuleLexer from 'cjs-module-lexer';
import fs from 'fs';

const PREFIX = `\0entrypoint-`;
const filteredExports = ['__esModule'];

function findExportsWithRequire(path) {
  try {
    return Object.keys(require(path));
  } catch {
    return [];
  }
}

function findExportsWithLexer(code) {
  try {
    return cjsModuleLexer(code).exports;
  } catch {
    return [];
  }
}

export default function entrypoints(opts) {
  const data = new Map();

  for (const e of opts.input) {
    const path = require.resolve(e.path);
    const code = fs.readFileSync(path, 'utf-8');
    // find exports that can be statically analyzed using cjs-module-lexer
    // find exports that can be retreived by loading the code within node
    const requireExports = findExportsWithRequire(path);
    const lexedExports = findExportsWithLexer(code);

    // combine the found exports and deduplicate them
    const allExports = [...lexedExports, ...requireExports];
    let hasDefault = false;
    const exports = new Set();

    for (const exp of allExports) {
      if (exp === 'default') {
        hasDefault = true;
      } else if (!filteredExports.includes(exp)) {
        exports.add(exp);
      }
    }

    data.set(e.name, { exports: Array.from(exports), hasDefault, path });
  }

  return {
    // add entrypoints to rollup
    options(rollupOptions) {
      for (const name of data.keys()) {
        rollupOptions.input[name] = `${PREFIX}${name}`;
      }
    },

    // notify rollup we're handling this module
    resolveId(id) {
      if (id.startsWith(PREFIX)) {
        return id;
      }
      return null;
    },

    // generate the code for the entrypoint module, reexporting the imports from the commonjs module
    // this way rollup knows what we intend to export, wrapping the commonjs mdules with an es module
    load(id) {
      if (id.startsWith(PREFIX)) {
        const name = id.substring(PREFIX.length);
        const e = data.get(name);
        if (e.exports.length === 0) {
          // es module
          return `export * from "${e.path}";`;
        }
        // cjs module
        const defaultExport = e.hasDefault ? `import m from "${e.path}"; export default m; ` : '';
        return `${defaultExport}export { ${e.exports.join(', ')} } from "${e.path}";`;
      }
      return null;
    },
  };
}
