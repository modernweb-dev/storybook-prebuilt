const getPresets = require('@storybook/core/dist/server/presets.js').default;

const addons = ['@storybook/addon-essentials'];

export async function gatherAddonEntries(framework) {
  const options = { configDir: __dirname, framework };

  const presets = getPresets(addons, options);
  const preview = await presets.apply('config', [], options);
  const manager = await presets.apply('managerEntries', [], options);
  const controlsI = manager.findIndex(e => e.includes('addon-controls'));

  const result = manager.splice(controlsI, 1);
  manager.unshift(...result);
  return { manager, preview };
}

export function addonImports(framework) {
  const frameworkEntry = require.resolve(`../src/${framework}.js`);
  let imports;

  return {
    resolveId(id) {
      if (id.startsWith('__generated__')) {
        return id;
      }
      return undefined;
    },

    async load(id) {
      if (!imports) {
        imports = await gatherAddonEntries(framework);
      }

      if (id.startsWith('__generated__/manager.js')) {
        const managerImports = imports.manager.map(i => `import "${i}";`).join('');
        return `import '@storybook/core/dist/client/manager/index.js'; ${managerImports}`;
      }

      return undefined;
    },

    async transform(code, id) {
      if (id === frameworkEntry) {
        const previewImports = imports.preview
          .map(
            (path, i) => `import * as preset${i} from "${path}";registerPreviewEntry(preset${i});`,
          )
          .join('');

        return `${code}\n${previewImports}`;
      }
      return undefined;
    },
  };
}
