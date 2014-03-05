
// modules
var test = require('tape');

// libs
var pull = require('../lib/pull');


test('pull{}', function(t) {

  t.equal(typeof pull, 'object');
  t.equal(typeof pull.create, 'function');
  t.equal(typeof pull.patch, 'function');

  t.end();
});

test('pull.create()', function(t) {

  t.throws(function() { pull.create(); });
  t.throws(function() { pull.create(null); });
  t.throws(function() { pull.create(1); });
  t.throws(function() { pull.create('s'); });
  t.throws(function() { pull.create({}); });
  t.throws(function() { pull.create({}, null); });
  t.throws(function() { pull.create({}, 1); });
  t.throws(function() { pull.create({}, 's'); });
  t.doesNotThrow(function() { pull.create({}, {}); });

  var $pull = pull.create({ a: [1] }, { a: [1] });
  t.equal($pull, null);

  var $pull = pull.create({ a: [1, 2] }, { a: [1] });
  t.equal(typeof $pull, 'object');
  t.ok($pull.a);
  t.equal($pull.a.length, 1);
  t.equal($pull.a[0], 2);

  var $pull = pull.create({ a: { b: [1, 2] }}, { a: { b: [1] }});
  t.equal(typeof $pull, 'object');
  t.ok($pull['a.b']);
  t.equal($pull['a.b'].length, 1);
  t.equal($pull['a.b'][0], 2);

  var $pull = pull.create({ a: { b: [1, 2, 2] }}, { a: { b: [1, 2, 3] }});
  t.equal(typeof $pull, 'object');
  t.ok($pull['a.b']);
  t.equal($pull['a.b'].length, 1);
  t.equal($pull['a.b'][0], 2);

  var $pull = pull.create({ a: { b: [1, 2] }}, { a: 1 });
  t.equal($pull, null);

  var a = { a: [1, 2] };
  var b = { a: [1] };
  var $pull = pull.create(a, b);
  t.ok(a.a);
  t.ok(b.a);
  t.equal(a.a.length, 0);
  t.equal(b.a.length, 0);

  var a = { a: { b: [1, 2] }};
  var b = { a: { b: [1] }};
  var $pull = pull.create(a, b);
  t.ok(a.a);
  t.ok(b.a);
  t.ok(a.a.b);
  t.ok(b.a.b);
  t.equal(a.a.b.length, 0);
  t.equal(b.a.b.length, 0);

  var a = { a: { b: [1, 2, 2] }};
  var b = { a: { b: [1, 2, 3] }};
  var $pull = pull.create(a, b);
  t.ok(b.a);
  t.ok(b.a.b);
  t.equal(b.a.b.length, 1);
  t.equal(b.a.b[0], 3);

  var a = { a: [{ c: 1 }] };
  var b = { a: [{ b: 1 }] };
  var $pull = pull.create(a, b);
  t.ok(a.a);
  t.ok(b.a);
  t.equal(a.a.length, 0);
  t.equal(b.a.length, 1);
  t.ok(b.a[0]);
  t.equal(b.a[0].b, 1);

  t.end();
});

test('pull.patch()', function(t) {

  t.throws(function() { pull.patch(); });
  t.throws(function() { pull.patch(null); });
  t.throws(function() { pull.patch(1); });
  t.throws(function() { pull.patch('s'); });
  t.throws(function() { pull.patch({}); });
  t.throws(function() { pull.patch({}, 1); });
  t.throws(function() { pull.patch({}, 's'); });
  t.doesNotThrow(function() { pull.patch({}, null); });
  t.doesNotThrow(function() { pull.patch({}, {}); });

  var obj = { a: [1] };
  pull.patch(obj, null);
  t.ok(obj.a);
  t.equal(obj.a.length, 1);
  t.equal(obj.a[0], 1);

  var obj = { a: [1, 2] };
  pull.patch(obj, { a: [1] });
  t.ok(obj.a);
  t.equal(obj.a.length, 1);
  t.equal(obj.a[0], 2);

  t.end();
});
