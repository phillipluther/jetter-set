import { JetterSetObject, JetterSetWatcher } from './types';
import createStore from './utils/create-store';

export default function jetterSet(attrs: JetterSetObject): JetterSetObject {
  const store = createStore();

  return new Proxy(Object.assign(store, attrs), {
    get(store, prop) {
      return store[prop];
    },
    set(store, prop, val) {
      if (store.derivatives[prop]) {
        console.warn(
          '[JetterSet]',
          `${prop.toString()} is a derived property and can not be set directly; if you need to change how this value is calculated use the 'derive' API instead`,
        );

        return true;
      }

      store.history = Object.keys(store).reduce((acc: JetterSetObject, key) => {
        acc[key] = store[key];
        return acc;
      }, {});

      const hasDerivatives = typeof store.derivers[prop] !== 'undefined';

      // apply updates
      store[prop] = val;

      if (hasDerivatives) {
        store.derivers[prop].forEach((derivedProp: string) => {
          store[derivedProp] = store.derivatives[derivedProp].call(store, store);
        });
      }

      // trigger watchers
      const watchers = store.watchers[prop] ? store.watchers[prop].slice() : [];
      watchers.forEach((watcher: JetterSetWatcher) => {
        watcher.call(store, val, store.history[prop], store);
      });

      if (hasDerivatives) {
        store.derivers[prop].forEach((derivedProp: string) => {
          if (store.watchers[derivedProp]) {
            store.watchers[derivedProp].forEach((watcher: JetterSetWatcher) => {
              watcher.call(store, store[derivedProp], store.history[derivedProp], store);
            });
          }
        });
      }

      return true;
    },
  });
}

const o = jetterSet({
  apples: 2,
  pears: 3,
  carrots: 6,
  onions: 2,
});

o.derive('fruit', (obj: JetterSetObject) => {
  return obj.apples + obj.pears;
});

o.onChange('carrots', (newVal: number) => {
  if (newVal < 2) {
    console.log('\n> Buy more carrots!\n');
  }
});

o.onChange('fruit', (newVal: number, oldVal: number) => {
  console.log('\n> Nice fruit update:', `from ${oldVal} to ${newVal}\n`);
});

console.log('\n\n-----\nBeginning\n', o);

// o.fruit = 99;

// console.log('Derivers', o.derivers);
// console.log('gimme carrots', o.carrots);
// console.log('New derivers', o.derivers);

o.apples = 5;
o.carrots = 1;
o.pears = 10;

// console.log('Object', o);
// console.log('Derived fruit', o.fruit);
console.log('\n\n-----\nEnding\n', o);

console.log('Watchers', o.watchers);
