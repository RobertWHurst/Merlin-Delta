
// libs
var Delta = require('./lib/delta');


exports.create = function(obj, modObj) {
  return Delta.create(obj, modObj);
};

exports.patch = function(obj, diff) {
  return Delta.patch(obj, diff);
};

exports.Delta = Delta;
