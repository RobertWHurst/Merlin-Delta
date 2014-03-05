
// modules
var test = require('tape');

// libs
var push = require('../lib/push');


test('push{}', function(t) {

  t.equal(typeof push, 'object');
  t.equal(typeof push.create, 'function');
  t.equal(typeof push.patch, 'function');

  t.end();
});

test('push.create()', function(t) {

  t.throws(function() { push.create(); });
  t.throws(function() { push.create(null); });
  t.throws(function() { push.create(1); });
  t.throws(function() { push.create('s'); });
  t.throws(function() { push.create({}); });
  t.throws(function() { push.create({}, null); });
  t.throws(function() { push.create({}, 1); });
  t.throws(function() { push.create({}, 's'); });
  t.doesNotThrow(function() { push.create({}, {}); });

  var $push = push.create({ a: [1] }, { a: [1] });
  t.equal($push, null);

  var $push = push.create({ a: [1] }, { a: [1, 2] });
  t.equal(typeof $push, 'object');
  t.ok($push.a);
  t.equal($push.a.length, 1);
  t.equal($push.a[0], 2);

  var $push = push.create({ a: { b: [1] }}, { a: { b: [1, 2] }});
  t.equal(typeof $push, 'object');
  t.ok($push['a.b']);
  t.equal($push['a.b'].length, 1);
  t.equal($push['a.b'][0], 2);

  var $push = push.create({ a: { b: [1, 2, 3] }}, { a: { b: [1, 2, 2] }});
  t.equal(typeof $push, 'object');
  t.ok($push['a.b']);
  t.equal($push['a.b'].length, 1);
  t.equal($push['a.b'][0], 2);

  var $push = push.create({ a: { b: 1 }}, { a: [1, 2] });
  t.equal($push, null);

  var a = { a: [1] };
  var b = { a: [1, 2] };
  push.create(a, b);
  t.ok(a.a);
  t.ok(b.a);
  t.equal(a.a.length, 0);
  t.equal(b.a.length, 0);

  var a = { a: { b: [1] }};
  var b = { a: { b: [1, 2] }};
  push.create(a, b);
  t.ok(a.a);
  t.ok(b.a);
  t.ok(a.a.b);
  t.ok(b.a.b);
  t.equal(a.a.b.length, 0);
  t.equal(b.a.b.length, 0);

  var a = { a: { b: [1, 2, 2] }};
  var b = { a: { b: [1, 2, 3] }};
  push.create(a, b);
  t.ok(b.a);
  t.ok(b.a.b);
  t.equal(a.a.b.length, 1);
  t.equal(a.a.b[0], 2);

  var a = { a: [{ b: 1 }] };
  var b = { a: [{ c: 1 }] };
  push.create(a, b);
  t.ok(a.a);
  t.ok(b.a);
  t.equal(a.a.length, 1);
  t.equal(b.a.length, 0);
  t.ok(a.a[0]);
  t.equal(a.a[0].b, 1);

  t.end();
});

test('push.patch()', function(t) {

  t.throws(function() { push.patch(); });
  t.throws(function() { push.patch(null); });
  t.throws(function() { push.patch(1); });
  t.throws(function() { push.patch('s'); });
  t.throws(function() { push.patch({}); });
  t.throws(function() { push.patch({}, 1); });
  t.throws(function() { push.patch({}, 's'); });
  t.doesNotThrow(function() { push.patch({}, null); });
  t.doesNotThrow(function() { push.patch({}, {}); });

  var obj = { a: [1] };
  push.patch(obj, null);
  t.ok(obj.a);
  t.equal(obj.a.length, 1);
  t.equal(obj.a[0], 1);

  var obj = { a: [1, 2] };
  push.patch(obj, { a: [3] });
  t.ok(obj.a);
  t.equal(obj.a.length, 3);
  t.equal(obj.a[2], 3);

  t.end();
});
