export default options => {
  const replacements = {};
  for (const [k, v] of Object.entries(options)) {
    const path = require.resolve(k);
    if (!path) {
      throw new Error(`Could not find module: ${k}`);
    }
    replacements[path] = v;
  }

  return {
    load(id) {
      if (id in replacements) {
        console.log('Replacing module', id);
        return replacements[id];
      }
      return null;
    },
  };
};
