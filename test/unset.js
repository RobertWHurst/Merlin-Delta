
// modules
var test = require('tape');

// libs
var unset = require('../lib/unset');


test('unset{}', function(t) {

  t.equal(typeof unset, 'object');
  t.equal(typeof unset.create, 'function');
  t.equal(typeof unset.patch, 'function');

  t.end();
});

test('unset.create()', function(t) {

  t.throws(function() { unset.create(); });
  t.throws(function() { unset.create(null); });
  t.throws(function() { unset.create(1); });
  t.throws(function() { unset.create('s'); });
  t.throws(function() { unset.create({}); });
  t.throws(function() { unset.create({}, null); });
  t.throws(function() { unset.create({}, 1); });
  t.throws(function() { unset.create({}, 's'); });
  t.doesNotThrow(function() { unset.create({}, {}); });

  var $unset = unset.create({ a: 1 }, { a: 1 });
  t.equal($unset, null);

  var $unset = unset.create({ a: 1, b: 1 }, { a: 1 });
  t.equal(typeof $unset, 'object');
  t.equal($unset.length, 1);
  t.equal($unset[0], 'b');

  var $unset = unset.create({ a: 1, b: { c: 1 }}, { a: 1 });
  t.equal(typeof $unset, 'object');
  t.equal($unset.length, 1);
  t.equal($unset[0], 'b');

  var $unset = unset.create({ a: 1, b: { c: 1 }}, { a: 1, b: {} });
  t.equal(typeof $unset, 'object');
  t.equal($unset.length, 1);
  t.equal($unset[0], 'b.c');

  var $unset = unset.create({ a: 1, b: [{ c: 1 }] }, { a: 1, b: [{}] });
  t.equal($unset, null);

  var a = { a: 1, b: 1 };
  var b = { a: 1 };
  var $unset = unset.create(a, b);
  t.notOk(a.b);

  var a = { a: 1, b: { c: 1 }};
  var b = { a: 1 };
  var $unset = unset.create(a, b);
  t.notOk(a.b);

  var a = { a: 1, b: { c: 1 }};
  var b = { a: 1, b: {} };
  var $unset = unset.create(a, b);
  t.ok(a.b);
  t.notOk(a.b.c);

  var a = { a: 1, b: [{ c: 1 }] };
  var b = { a: 1, b: [] };
  var $unset = unset.create(a, b);
  t.ok(a.b[0]);

  t.end();
});

test('unset.patch()', function(t) {

  t.throws(function() { unset.patch(); });
  t.throws(function() { unset.patch(null); });
  t.throws(function() { unset.patch(1); });
  t.throws(function() { unset.patch('s'); });
  t.throws(function() { unset.patch({}); });
  t.throws(function() { unset.patch({}, 1); });
  t.throws(function() { unset.patch({}, 's'); });
  t.doesNotThrow(function() { unset.patch({}, null); });
  t.doesNotThrow(function() { unset.patch({}, {}); });

  var obj = { a: 1 };
  var $unset = unset.patch(obj, null);
  t.ok(obj.a);

  var obj = { a: 1, b: 1 };
  unset.patch(obj, ['b']);
  t.ok(obj.a);
  t.notOk(obj.b);

  var obj = { a: 1, b: { c: 1 }};
  unset.patch(obj, ['b']);
  t.ok(obj.a);
  t.notOk(obj.b);

  var obj = { a: 1, b: { c: 1 }};
  unset.patch(obj, ['b.c']);
  t.ok(obj.a);
  t.ok(obj.b);
  t.notOk(obj.b.c);

  t.end();
});
