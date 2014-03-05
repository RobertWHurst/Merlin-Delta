
/**
 * Patch
 * @param  {Object} obj    Object to patch.
 * @param  {Object} rename Rename diff to apply.
 * @return {Object}        Object to patch.
 */
exports.patch = function(obj, rename) {

  // validate
  if(obj === null || typeof obj != 'object') { throw new Error('obj must be an object'); }
  if(typeof rename != 'object') { throw new Error('rename must be an object or null'); }

  // return if the rename is null
  if(rename === null) { return obj; }

  // loop through and rename each path
  for(var srcPath in rename) {

    // get the paths
    var dstPath = rename[srcPath].split('.');
    var dstProp = dstPath.pop();
    srcPath = srcPath.split('.');
    var srcProp = srcPath.pop();

    // get the obj pointers
    var srcObj = obj;
    var dstObj = obj;

    // traverse into the obj to find the src value
    while(srcPath.length > 0 && srcObj !== null && typeof srcObj == 'object') {
      srcObj = srcObj[srcPath.shift()];
    }
    if(srcPath.length == 0 && srcObj !== null && typeof srcObj == 'object') {

      // if the src value is found then traverse
      // the object again, this time to the dst
      // location. If the path is missing then
      // create it.
      while(dstPath.length > 0 && dstObj !== null && typeof dstObj == 'object') {
        if(dstObj[dstPath[0]] === null || typeof dstObj[dstPath[0]] != 'object') {
          dstObj[dstPath[0]] = {};
        }
        dstObj = dstObj[dstPath.shift()];
      }

      // set the src value at the new dst, and
      // delete the src location.
      dstObj[dstProp] = srcObj[srcProp];
      delete srcObj[srcProp];
    }
  }
  return obj;
};

