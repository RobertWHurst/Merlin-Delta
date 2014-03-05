
var test = require('tape');

var Delta = require('../lib/delta');


test('Delta()', function(t) {
  
  t.throws(function() { new Delta(); });
  t.throws(function() { new Delta(1); });
  t.throws(function() { new Delta('s'); });
  t.throws(function() { new Delta(true); });
  t.doesNotThrow(function() { new Delta({}); });
  t.doesNotThrow(function() { new Delta(null); });

  t.equal(typeof Delta.create, 'function');
  t.equal(typeof Delta.patch, 'function');

  t.end();
});

test('Delta.create()', function(t) {

  t.throws(function() { Delta.create(); });
  t.throws(function() { Delta.create(null); });
  t.throws(function() { Delta.create(1); });
  t.throws(function() { Delta.create('s'); });
  t.throws(function() { Delta.create({}); });
  t.throws(function() { Delta.create({}, null); });
  t.throws(function() { Delta.create({}, 1); });
  t.throws(function() { Delta.create({}, 's'); });
  t.doesNotThrow(function() { Delta.create({}, {}); });

  d = Delta.create({}, { a: 1 }).diff;
  t.ok(d.$set);
  t.notOk(d.$unset);
  t.notOk(d.$pull);
  t.notOk(d.$push);
  t.ok(d.$set.a, 1);

  d = Delta.create({ a: 1 }, {}).diff;
  t.ok(d.$unset);
  t.notOk(d.$set);
  t.notOk(d.$pull);
  t.notOk(d.$push);
  t.equal(d.$unset[0], 'a');

  d = Delta.create({ a: [1] }, { a: [1, 2] }).diff;
  t.ok(d.$push);
  t.notOk(d.$set);
  t.notOk(d.$unset);
  t.notOk(d.$pull);
  t.equal(d.$push.a[0], 2);

  d = Delta.create({ a: [1, 2] }, { a: [1] }).diff;
  t.ok(d.$pull);
  t.notOk(d.$set);
  t.notOk(d.$unset);
  t.notOk(d.$push);
  t.equal(d.$pull.a[0], 2);

  var oldWidget = {
    type: 'doHickey',
    size: 'large',
    power: {
      torque: 110,
      hp: 98
    },
    weight: 10241,
    tags: ['powerful', 'awesome', 'quick']
  };
  var newWidget = {
    type: 'do-hickey',
    power: {
      watts: 4700,
      torque: 110,
      hp: 98
    },
    weight: 10241,
    tags: ['powerful', 'awesome', 'fast'],
    meta: { foo: true, bar: null }
  };
  d = Delta.create(oldWidget, newWidget).diff;
  t.ok(d.$set);
  t.equal(d.$set.type, 'do-hickey');
  t.equal(d.$set['power.watts'], 4700);
  t.ok(d.$set.meta);
  t.equal(d.$set.meta.foo, true);
  t.equal(d.$set.meta.bar, null);

  t.ok(d.$push);
  t.ok(d.$push.tags);
  t.equal(d.$push.tags[0], 'fast');

  t.ok(d.$unset);
  t.equal(d.$unset[0], 'size');

  t.ok(d.$pull);
  t.ok(d.$pull.tags);
  t.equal(d.$pull.tags[0], 'quick');

  t.end();
});

test('Delta.patch()', function(t) {

  t.throws(function() { Delta.patch(); });
  t.throws(function() { Delta.patch(null); });
  t.throws(function() { Delta.patch(1); });
  t.throws(function() { Delta.patch('s'); });
  t.throws(function() { Delta.patch({}); });
  t.throws(function() { Delta.patch({}, 1); });
  t.throws(function() { Delta.patch({}, 's'); });
  t.doesNotThrow(function() { Delta.patch({}, null); });
  t.doesNotThrow(function() { Delta.patch({}, {}); });

  d = Delta.patch({ a: 1 }, { $rename: { a: 'b' } });
  t.notOk(d.a);
  t.equal(d.b, 1);

  d = Delta.patch({}, { $set: { a: 1 } });
  t.equal(d.a, 1);

  d = Delta.patch({ a: 1, b: 1 }, { $unset: ['a'] });
  t.notOk(d.a);
  t.ok(d.b);

  d = Delta.patch({ a: [1] }, { $push: { a: [2] }});
  t.equal(d.a.length, 2);
  t.equal(d.a[0], 1);
  t.equal(d.a[1], 2);

  d = Delta.patch({ a: [1, 2] }, { $pull: { a: [2] }});
  t.equal(d.a.length, 1);
  t.equal(d.a[0], 1);

  t.end();
});
