
// modules
var equal = require('deep-equal');

/**
 * Patch
 * @param  {Object} obj    Object to diff.
 * @param  {Object} modObj Object to diff against.
 * @return {Object}        Set diff.
 */
exports.create = function(obj, modObj) {

  // validate
  if(obj === null || typeof obj != 'object') { throw new Error('obj must be an object'); }
  if(modObj === null || typeof modObj != 'object') { throw new Error('modObj must be an object'); }

  var set = null;
  (function rec(path, obj, modObj) {
    for(var prop in modObj) {
      var subPath = path && path + '.' + prop || prop;

      if(modObj.hasOwnProperty(prop)) {

        // check the modObj to see if the property
        // exists.
        if(typeof obj[prop] != 'object' && modObj[prop] !== obj[prop]) {
          if(!set) { set = {}; }
          set[subPath] = modObj[prop];
          delete modObj[prop];
          if(obj.hasOwnProperty(prop)) { delete obj[prop]; }
        }

        // if the property contains an object and
        // on both the obj and the modObj. Arrays
        // are ignored.
        else if(
          obj[prop] !== null && modObj[prop] !== null &&
          typeof obj[prop] == 'object' && typeof modObj[prop] == 'object' &&
          obj[prop].constructor != Array && modObj[prop].length != Array
        ) { rec(subPath, obj[prop], modObj[prop]); }
      }
    }
  })('', obj, modObj);
  return set;
};


/**
 * Patch
 * @param  {Object} obj Object to patch.
 * @param  {Object} set Rename diff to apply.
 * @return {Object}     Object to patch.
 */
exports.patch = function(obj, set) {

  // validate
  if(obj === null || typeof obj != 'object') { throw new Error('obj must be an object'); }
  if(typeof set != 'object') { throw new Error('set must be an object or null'); }

  // return if the set is null
  if(set === null) { return obj; }

  // loop through and set each path
  for(var path in set) {
    var dst = obj;
    if(set.hasOwnProperty(path)) {
      var val = set[path];
      var path = path.split('.');
      var prop = path.pop();
      while(path.length > 0 && dst !== null && typeof dst == 'object') {
        if(dst[path[0]] === null || typeof dst[path[0]] != 'object') {
          dst[path[0]] = {};
        }
        dst = dst[path.shift()];
      }
      if(path.length == 0 && dst !== null && typeof dst == 'object') {
        dst[prop] = val;
      }
    }
  }
  return obj;
};

