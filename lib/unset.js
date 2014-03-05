
/**
 * Patch
 * @param  {Object} obj    Object to diff.
 * @param  {Object} modObj Object to diff against.
 * @return {Object}        Unset diff.
 */
exports.create = function(obj, modObj) {

  // validate
  if(obj === null || typeof obj != 'object') { throw new Error('obj must be an object'); }
  if(modObj === null || typeof modObj != 'object') { throw new Error('modObj must be an object'); }

  var unset = null;
  (function rec(path, obj, modObj) {
    for(var prop in obj) {
      var subPath = path && path + '.' + prop || prop;
      if(obj.hasOwnProperty(prop)) {

        // check the modObj to see if the property
        // exists.
        if(typeof modObj[prop] != 'object' && obj[prop] !== modObj[prop]) {
          if(!unset) { unset = []; }
          unset.push(subPath);
          delete obj[prop];
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
  return unset;
};

/**
 * Patch
 * @param  {Object} obj   Object to patch.
 * @param  {Object} unset Rename diff to apply.
 * @return {Object}       Object to patch.
 */
exports.patch = function(obj, unset) {

  // validate
  if(obj === null || typeof obj != 'object') { throw new Error('obj must be an object'); }
  if(typeof unset != 'object') { throw new Error('unset must be an object or null'); }

  // return if the unset is null
  if(unset === null) { return obj; }

  // loop through and unset each path
  for(var i = 0; i < unset.length; i += 1) {
    var dst = obj;
    var path = unset[i].split('.');
    var prop = path.pop();
    while(path.length > 0 && dst !== null && typeof dst == 'object') {
      dst = dst[path.shift()];
    }
    if(path.length == 0 && dst !== null && typeof dst == 'object') {
      delete dst[prop];
    }
  }
  return obj;
};

