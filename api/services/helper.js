module.exports.objectHasOnly = function (object, keys) {
  if (Object.keys(object).length > keys.length) return false;

  for (let key in object) {
    if (!keys.includes(key)) return false;
  }

  return true;
};
