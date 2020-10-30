export default fragments => ({
  load(id) {
    if (fragments.some(f => id.includes(f))) {
      return '';
    }
    return null;
  },
});
