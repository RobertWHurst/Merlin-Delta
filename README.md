Merlin Delta
=============

Merlin Schema is a delta implementation
developed for the (soon to be released) Merlin ORM.

Designed as a standalone package to allow anyone
to create and apply deltas without needing an entire
ORM.

Use it with node or in the browser using
browserify.

```shell
npm install merlin-delta
```

[![NPM version](https://badge.fury.io/js/merlin-delta.png)](http://badge.fury.io/js/merlin-delta)

Example
-------
```javascript
var delta = require('merlin-delta');

// create an old version of a person record
var oldRecord = {
  name: {
    first: 'John',
    last: 'Doe'
  },
  born: new Date('Jan 23, 1981'),
  sex: 'M'
};

// create an new version of a person record
var newRecord = {
  name: {
    first: 'Johnny',
    last: 'Doe'
  },
  born: new Date('Jan 24, 1981'),
  sex: 'M'
};

// create a delta from the old and new copy of the record
var delta = delta.create(oldRecord, newRecord);

// lets look at the diff
delta.diff => {
  $set: {
    'name.first': 'Johnny',
    born: Sat Jan 24 1981 00:00:00 GMT-0800 (PST)
  }
};
```
