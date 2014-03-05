
// modules
var test = require('tape');

// libs
var rename = require('../lib/rename');


test('rename{}', function(t) {

  t.equal(typeof rename, 'object');
  t.equal(typeof rename.patch, 'function');

  t.end();
});

test('rename.patch()', function(t) {

  t.throws(function() { rename.patch(); });
  t.throws(function() { rename.patch(null); });
  t.throws(function() { rename.patch(1); });
  t.throws(function() { rename.patch('s'); });
  t.throws(function() { rename.patch({}); });
  t.throws(function() { rename.patch({}, 1); });
  t.throws(function() { rename.patch({}, 's'); });
  t.doesNotThrow(function() { rename.patch({}, null); });
  t.doesNotThrow(function() { rename.patch({}, {}); });

  var obj = { a: 1 };
  var $rename = rename.patch(obj, null);
  t.ok(obj.a);

  var obj = { a: 1, b: 1 };
  rename.patch(obj, { b: 'c' });
  t.ok(obj.a);
  t.equal(obj.c, 1);
  t.notOk(obj.b);

  var obj = { a: 1, b: { c: 1 }};
  rename.patch(obj, { b: 'c' });
  t.ok(obj.a);
  t.ok(obj.c);
  t.equal(obj.c.c, 1);
  t.notOk(obj.b);

  var obj = { a: 1, b: { c: 1 }};
  rename.patch(obj, { 'b.c': 'b.d' });
  t.ok(obj.a);
  t.ok(obj.b);
  t.notOk(obj.b.c);
  t.equal(obj.b.d, 1);

  var obj = { a: 1, b: { c: 1 }};
  rename.patch(obj, { 'b.c': 'b' });
  t.ok(obj.a);
  t.ok(obj.b);
  t.equal(obj.b, 1);

  var obj = { a: 1, b: { c: 1 }};
  rename.patch(obj, { 'b.c': 'c.c' });
  t.ok(obj.a);
  t.ok(obj.b);
  t.notOk(obj.b.c);
  t.ok(obj.c);
  t.equal(obj.c.c, 1);

  t.end();
});


