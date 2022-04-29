# JetterSet

> Declarative, observable objects with live data bindings.

This project modernizes my original JetSet micro-library; JetterSet (a better JetSet) trades a few bytes for robustness and an improved API. [Check out](https://www.npmjs.com/package/jet-set) the original, or read on.

JetterSet is about 930 bytes with 0 dependencies.

## Installation and Usage

```bash
npm install jetter-set
```

```js
import { jetterSet } from 'jetter-set';

...

const superChargedObject = jetterSet({ ...defaultValues })
```

### Setting Values

Treat your handy JetterSet as a standard JavaScript object.

```js
const obj = jetterSet({
  apples: 3,
  pears: 2,
});

obj.oranges = 5;
delete obj.apples;

console.log(Object.keys(obj)); // pears, oranges
```

### Deriving Values | `derive`

One of JetterSet's neatest features is deriving values from existing properties. Do this via the `derive` method.

```js
const obj = jetterSet({ apples: 3, pears: 2 });
obj.derive('fruit', (obj) => obj.apples + obj.pears);

console.log(obj.fruit); // 5
```

Derived values change when upstream values change.

```js
const obj = jetterSet({ apples: 3, pears: 2 });
obj.derive('fruit', (obj) => obj.apples + obj.pears);

console.log(obj.fruit); // 5

obj.apples = 100;

console.log(obj.fruit); // 102
```

### Watching Values | `onChange`

You can also watch for updates on your JetterSet's properties. This is done via the `onChange` method.

```js
const obj = jetterSet({ apples: 3, pears: 2 });
obj.onChange('apples', (newVal, oldVal, updatedObj) => {
  if (newVal < 2) {
    console.log(`Buy more apples! You had ${oldVal} but are now down to ${newVal}`);
  }
});

obj.apples = 1; // "Buy more apples! You had 3 but are now down to 1
```

### Unwatching Values | `offChange`

To remove a properties watcher, use the `offChange` method. As with all handlers/listeners of this nature, passing named or referenced functions is gonna help.

```js
const obj = jetterSet({ apples: 3, pears: 2 });
const changeHandler = () => console.log('Changed!');

obj.onChange('apples', changeHandler);
obj.apples = 99; // "Changed!"

obj.offChange('apples', changeHandler);
obj.apples = 0; //
```
