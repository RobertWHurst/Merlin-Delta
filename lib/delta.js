
// modules
var clone = require('clone');

// modifiers
var rename = require('./rename');
// var dec = require('./dec');
// var inc = require('./inc');

// removal
var unset = require('./unset');
var pull = require('./pull');

// creation
var set = require('./set');
var push = require('./push');


/**
 * Delta constructor.
 * @constructor
 * @param {Object} diff Delta diff.
 */
function Delta(diff) {

  // defaults
  if(diff === null) { diff = {}; }

  // validate
  if(typeof diff != 'object') { throw new Error('diff must be an object'); }
  var ops = [
    '$rename', '$set', '$unset',
    '$push', '$pull',
    '$inc', '$dec'
  ];
  var keys = Object.keys(diff);
  for(var i = 0; i < keys.length; i += 1) {
    if(ops.indexOf(keys[i]) == -1) { throw new Error(keys[i] + ' is not a valid delta operator.'); }
  }

  // setup
  this.diff = diff;
}

/**
 * Create a delta from an old and new object.
 * @param  {Object} obj    Original object.
 * @param  {Object} modObj Modified object.
 * @return {Delta}         Delta object.
 */
Delta.create = function(obj, modObj) {

  obj = clone(obj);
  modObj = clone(modObj);
  var diff = {};
  var spentPaths = {};

  // creation
  var $set = set.create(obj, modObj);
  if($set) { diff.$set = $set; }
  var $push = push.create(obj, modObj);
  if($push) { diff.$push = $push; }

  // removal
  var $unset = unset.create(obj, modObj);
  if($unset) { diff.$unset = $unset; }
  var $pull = pull.create(obj, modObj);
  if($pull) { diff.$pull = $pull; }

  // create the delta fro mthe diff
  return new Delta(diff);
};

/**
 * Apply diff to object
 * @param  {Object} obj  Object to patch.
 * @param  {Object} diff Diff object.
 * @return {Object}      Object to patch.
 */
Delta.patch = function(obj, diff) {
  return (new Delta(diff)).patch(obj);
};

/**
 * Apply the delta to an object.
 * @param  {Object} obj  Object to patch.
 * @return {Object}      Object to patch.
 */
Delta.prototype.patch = function(obj) {

  if(obj === null || typeof obj != 'object') { return obj; }

  // modification
  if(this.diff.$rename) { rename.patch(obj, this.diff.$rename); }

  // removal
  if(this.diff.$unset) { unset.patch(obj, this.diff.$unset); }
  if(this.diff.$pull) { pull.patch(obj, this.diff.$pull); }

  // creation
  if(this.diff.$set) { set.patch(obj, this.diff.$set); }
  if(this.diff.$push) { push.patch(obj, this.diff.$push); }

  return obj;
};

/**
 * Get the diff of the delta.
 * @private
 * @return {Object} Diff object.
 */
Delta.prototype.valueOf = function() {
  return this.diff;
};

/**
 * Get the diff of the delta.
 * @return {Object} Diff object.
 */
Delta.prototype.toJSON = function() {
  return this.diff;
};

/**
 * Get the diff of the delta as a JSON string.
 * @return {String} Diff JSON string.
 */
Delta.prototype.toString = function() {
  return JSON.stringify(this);
};


module.exports = Delta;
