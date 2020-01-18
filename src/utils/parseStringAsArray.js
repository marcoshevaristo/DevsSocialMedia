module.exports = function parseStringAsArray(value) {
  return value ? value.split(',').map(tech => tech.trim()) : null;
};
