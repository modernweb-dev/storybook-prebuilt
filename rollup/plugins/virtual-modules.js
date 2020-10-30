export default modules => ({
  resolveId(id) {
    if (id in modules) {
      return id;
    }
    return null;
  },

  load(id) {
    if (id in modules) {
      return modules[id];
    }
    return null;
  },
});
