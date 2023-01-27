# JetterSet

JetterSet is a micro-library for making JavaScript objects reactive. It's (naturally!) declarative, memoizes derived/computed values, and provides callback hooks for handling property changes.

Effectively, this:

```javascript
myObj.apples = 3;
myObj.bananas = 1;

// assuming `fruit` is a computed property of apples + bananas …
console.log(myObj.fruit); // 4

myObj.bananas = 3;

console.log(myObj.fruit); // 6
```

JetterSet is about 1k with 0 dependencies.

## Installation and Usage

```bash
npm install jetter-set
```

```js
import { jetterSet } from 'jetter-set';

…

const newReactiveObject = jetterSet({ ...defaultValues })
```

### Setting Values

Treat your handily reactive JetterSet object as a standard JavaScript object. Properties get accessed and assigned normally -- no special getter or setter methods.

```js
const obj = jetterSet({
  apples: 3,
  pears: 2,
});

obj.oranges = 5;
obj.bananas = 2;
delete obj.apples;

console.log(Object.keys(obj)); // pears, oranges, bananas
```

### Deriving Values | `derive`

One of JetterSet's neatest features is deriving values from existing properties. Do this via the `derive` method.

```js
const obj = jetterSet({ apples: 3, pears: 2 });
obj.derive('fruit', (obj) => obj.apples + obj.pears);

console.log(obj.fruit); // 5
```

Derived (or computed, if you prefer) values change when upstream values change.

```js
const obj = jetterSet({ apples: 3, pears: 2 });
obj.derive('fruit', (obj) => obj.apples + obj.pears);

console.log(obj.fruit); // 5

obj.apples = 100;

console.log(obj.fruit); // 102
```

#### Memoization of Derived/Computed Values

When upstream signals change, JetterSet memoizes derived values. Reactive functions only runs once -- even when deriving values from other derived values -- and the result gets stashed in an intermediary cache until signaling values change again.

### Watching Values | `onChange`

You can also watch for updates on your JetterSet's properties. This is done via the `onChange` method.

```js
const obj = jetterSet({ apples: 3, pears: 2 });
obj.onChange('apples', (newVal, oldVal, updatedObj) => {
  if (newVal < 2) {
    console.log(`Buy more apples! You had ${oldVal} but are now down to ${newVal}`);
  }
});

obj.apples = 1; // "Buy more apples! You had 3 but are now down to 1"
```

Naturally, you can watch for changes on derived values, too.

```js
const obj = jetterSet({ apples: 3, pears: 2 });

obj.derive('fruit', (obj) => obj.apples + obj.pears);
obj.onChange('fruit', (newVal, oldVal, updatedObj) => {
  console.log(`You had ${oldVal} apples and pears; now you have ${newVal}`);
});

obj.apples = 1; // "You had 5 apples and pears; now you have 3"
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

## Inspiration

This project modernizes my original [JetSet](https://www.npmjs.com/package/jet-set) micro-library, which I wrote as a code golf state management solution. JetterSet (a better JetSet) trades a few bytes for robustness and an improved feature set.
