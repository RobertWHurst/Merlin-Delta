
// modules
var equal = require('deep-equal');

/**
 * Patch
 * @param  {Object} obj    Object to diff.
 * @param  {Object} modObj Object to diff against.
 * @return {Object}        Pull diff.
 */
exports.create = function(obj, modObj) {

  // validate
  if(obj === null || typeof obj != 'object') { throw new Error('obj must be an object'); }
  if(modObj === null || typeof modObj != 'object') { throw new Error('modObj must be an object'); }

  var pull = null;
  (function rec(path, obj, modObj) {
    for(var prop in obj) {
      var subPath = path && path + '.' + prop || prop;
      if(
        obj.hasOwnProperty(prop) &&
        obj[prop] !== null && modObj[prop] !== null &&
        typeof obj[prop] == 'object' && typeof modObj[prop] == 'object'
      ) {

        // check the modObj to see if the property
        // exists.
        if(
          typeof obj[prop].length == 'number' &&
          typeof modObj[prop].length == 'number'
        ) {
          for(var i = 0; i < obj[prop].length; i += 1) {
            var found = false;
            for(var j = 0; j < modObj[prop].length; j += 1) {
              if(equal(obj[prop][i], modObj[prop][j])) {
                found = true;
                break;
              }
            }
            if(found) {
              modObj[prop].splice(j, 1);
            } else {
              if(!pull) { pull = {}; }
              if(!pull[subPath]) { pull[subPath] = []; }
              pull[subPath].push(obj[prop][i]);
            }
            obj[prop].splice(i, 1);
            i -= 1;
          }
        }

        // if the property contains an object and
        // on both the obj and the modObj. Arrays
        // are ignored.
        else { rec(subPath, obj[prop], modObj[prop]); }
      }
    }
  })('', obj, modObj);
  return pull;
};

/**
 * Patch
 * @param  {Object} obj  Object to patch.
 * @param  {Object} pull Rename diff to apply.
 * @return {Object}      Object to patch.
 */
exports.patch = function(obj, pull) {

  // validate
  if(obj === null || typeof obj != 'object') { throw new Error('obj must be an object'); }
  if(typeof pull != 'object') { throw new Error('pull must be an object or null'); }

  // return if the pull is null
  if(pull === null) { return obj; }

  // loop through and pull each path
  for(var path in pull) {
    var dst = obj;
    if(obj.hasOwnProperty(path)) {
      var val = pull[path];
      if(val === null || typeof val != 'object' || typeof val.length != 'number') {
        throw new Error('pull[\'' + path + '\'] must be an array');
      }
      var path = path.split('.');
      while(path.length > 0 && dst !== null && typeof dst == 'object') {
        dst = dst[path.shift()];
      }
      if(
        path.length == 0 && dst !== null &&
        typeof dst == 'object' && typeof dst.length == 'number'
      ) {
        for(var i = 0; i < val.length; i += 1) {
          for(var j = 0; j < dst.length; j += 1) {
            if(equal(val[i], dst[j])) {
              dst.splice(j, 1);
              break;
            }
          }
        }
      }
    }
  }
  return obj;
};

