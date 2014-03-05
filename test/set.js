
// modules
var test = require('tape');

// libs
var set = require('../lib/set');


test('set{}', function(t) {

  t.equal(typeof set, 'object');
  t.equal(typeof set.create, 'function');
  t.equal(typeof set.patch, 'function');

  t.end();
});

test('set.create()', function(t) {

  t.throws(function() { set.create(); });
  t.throws(function() { set.create(null); });
  t.throws(function() { set.create(1); });
  t.throws(function() { set.create('s'); });
  t.throws(function() { set.create({}); });
  t.throws(function() { set.create({}, null); });
  t.throws(function() { set.create({}, 1); });
  t.throws(function() { set.create({}, 's'); });
  t.doesNotThrow(function() { set.create({}, {}); });

  var $set = set.create({ a: 1 }, { a: 1 });
  t.equal($set, null);

  var $set = set.create({ a: 1 }, { a: 1, b: 1 });
  t.equal(typeof $set, 'object');
  t.equal($set.b, 1);

  var $set = set.create({ a: 1 }, { a: 1, b: { c: 1 }});
  t.equal(typeof $set, 'object');
  t.ok($set.b);
  t.equal($set.b.c, 1);

  var $set = set.create({ a: 1, b: {} }, { a: 1, b: { c: 1 }});
  t.equal(typeof $set, 'object');
  t.equal($set['b.c'], 1);

  var $set = set.create({ a: 1, b: [{}] }, { a: 1, b: [{ c: 1 }] });
  t.equal($set, null);

  var a = { a: 1 };
  var b = { a: 1, b: 1 };
  var $set = set.create(a, b);
  t.notOk(b.b);

  var a = { a: 1 };
  var b = { a: 1, b: { c: 1 }};
  var $set = set.create(a, b);
  t.notOk(b.b);

  var a = { a: 1, b: {} };
  var b = { a: 1, b: { c: 1 }};
  var $set = set.create(a, b);
  t.ok(b.b);
  t.notOk(b.b.c);

  var a = { a: 1, b: [] };
  var b = { a: 1, b: [{ c: 1 }] };
  var $set = set.create(a, b);
  t.ok(b.b[0]);

  t.end();
});

test('set.patch()', function(t) {

  t.throws(function() { set.patch(); });
  t.throws(function() { set.patch(null); });
  t.throws(function() { set.patch(1); });
  t.throws(function() { set.patch('s'); });
  t.throws(function() { set.patch({}); });
  t.throws(function() { set.patch({}, 1); });
  t.throws(function() { set.patch({}, 's'); });
  t.doesNotThrow(function() { set.patch({}, null); });
  t.doesNotThrow(function() { set.patch({}, {}); });

  var obj = { a: 1 };
  var $set = set.patch(obj, null);
  t.ok(obj.a);

  var obj = { a: 1 };
  set.patch(obj, { b: 1 });
  t.ok(obj.a);
  t.equal(obj.b, 1);

  var obj = { a: 1, b: { c: 1 } };
  set.patch(obj, { b: { d: 1 }});
  t.ok(obj.a);
  t.ok(obj.b);
  t.notOk(obj.b.c);
  t.equal(obj.b.d, 1);

  var obj = { a: 1, b: { c: 1 } };
  set.patch(obj, { 'b.d': 1 });
  t.ok(obj.a);
  t.ok(obj.b);
  t.equal(obj.b.c, 1);
  t.equal(obj.b.d, 1);

  t.end();
});
