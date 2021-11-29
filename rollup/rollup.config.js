/* eslint-disable global-require, import/no-dynamic-require, no-param-reassign  */
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import { terser } from "rollup-plugin-terser";
import builtins from "rollup-plugin-node-builtins";
import nodeGlobals from "rollup-plugin-node-globals";
import babel from "@rollup/plugin-babel";
import visualizer from "rollup-plugin-visualizer";
import json from "@rollup/plugin-json";
import inject from "@rollup/plugin-inject";
import commonjs from "@rollup/plugin-commonjs";

import filterModules from "./plugins/filter-modules.js";
import virtualModules from "./plugins/virtual-modules.js";
import replaceModules from "./plugins/replace-modules.js";
import { addonImports } from "./plugins/addonImports.js";
import entrypoints from './plugins/entrypoints.js';

export default {
  input: {
    "client-api": "src/client-api.js",
    "web-components": "src/web-components.js",
    preact: "src/preact.js",
    manager: "__generated__/manager.js",
  },

  preserveEntrySignatures: 'allow-extension',

  output: {
    dir: ".",
    format: "esm",
    sourcemap: true,
    chunkFileNames: "dist/storybook-prebuilt-[hash].js",
  },

  // make sure lit-html is imported at runtime and not bundled
  external: id => /lit-html/.test(id),

  plugins: [
    addonImports("web-components"),
    addonImports("preact"),
    entrypoints({
      input: [
        { name: "addons", path: "@storybook/addons" },
        { name: "api", path: "@storybook/api" },
        { name: "core-events", path: "@storybook/core-events" },
        { name: "theming", path: "@storybook/theming" },
        { name: "theming/create", path: "@storybook/theming/create" },
        { name: "addon-docs/blocks", path: "@storybook/addon-docs/blocks" },
      ],
    }),

    // OPTIMIZATION: filter out core-js polyfills to reduce bundle size
    filterModules(["node_modules/core-js"]),

    // allow loading json files as modules
    json(),

    // allow loading commonjs modules
    commonjs(),

    // A lot of modules check process.env.NODE_ENV for handling environment
    // specific code. We handle this in an efficent way in 3 steps:
    // 1) first the code them with a unique variable, so that it doesn't get
    // picked up by other plugins
    replace({
      values: {
        "process.env.NODE_ENV": "____environment____",
        "module && module.hot && module.hot.decline": "false",
      },
    }),
    // 2) then replace the variable with a unique import, this allows rollup
    // to tree shake dead code
    inject({
      ____environment____: "____environment____",
    }),
    // 3) provide the content for the ____environment____ module
    virtualModules({
      ____environment____: "export default 'production'",
    }),

    // rollup-plugin-node-builtins accesses process from global.process, which doesn't exist
    replace({
      include: [require.resolve("rollup-plugin-node-builtins/src/es6/util.js")],
      values: {
        "global.process": "process",
      },
    }),

    // OPTIMIZATION: filter out core-js polyfills to reduce bundle size
    filterModules(["node_modules/core-js"]),

    // polyfill nodejs globals such as `global` and `process`
    nodeGlobals({
      exclude: [
        '**/@storybook/components/dist/esm/blocks/Preview.js',
        '**/@storybook/preview-web/dist/esm/PreviewWeb.js',
      ]
    }),

    // polyfill nodejs modules, such as `require('util')`
    builtins(),

    // resolve bare module imports
    resolve({
      preferBuiltins: false,
      browser: true,
    }),

    // monkey patch some modules
    replaceModules({
      // OPTIMIZATION: prevent loading too many syntax highlighting languages, singificantly reducing bundle size
      // See: https://github.com/storybookjs/storybook/issues/9282
      "react-syntax-highlighter/dist/esm/index.js":
        "export { default as PrismLight } from './prism-light'",
    }),

    // lit-html is imported by @storybook/web-components as a default import,
    // which is incorrect
    {
      name: "lit-html-renamer-old",
      renderChunk(code) {
        return {
          code: code.replace("import _litHtml", "import * as _litHtml"),
          map: null,
        };
      },
    },
    {
      name: "lit-html-renamer-new",
      renderChunk(code) {
        return {
          code: code.replace(/import (\S*), { render } from 'lit-html';/, "import * as $1 from 'lit-html';import { render } from 'lit-html';"),
          map: null,
        };
      },
    },
    {
      name: "lit-html-renamer-new-2",
      renderChunk(code) {
        return {
          code: code.replace(/import \* as (\S*), { render } from 'lit-html';/, "import * as $1 from 'lit-html';import { render } from 'lit-html';"),
          map: null,
        };
      },
    },
    {
      name: "lit-html-directive-helpers-renamer-new",
      renderChunk(code) {
        return {
          code: code.replace(/import { isTemplateResult } from 'lit-html\/directive-helpers\.js';/, "import * as $1 from 'lit-html/directive-helpers.js';import { isTemplateResult } from 'lit-html/directive-helpers.js';"),
          map: null,
        };
      },
    },

    // the majority of the storybook ecosystem is es5, but some are not. we compile all to es5, so that we can skip
    // compiling it by users. when storybook dependencies start becoming non-es5, we can consider making a separate
    // non-es5 build
    babel({
      babelHelpers: 'bundled',
      presets: [
        [
          "@babel/env",
          {
            targets: ["ie 11"],
            useBuiltIns: false,
            modules: false,
          },
        ],
      ],
    }),

    // minify final output
    terser(),

    visualizer({ filename: "bundle-stats.html" }),
  ],
};
