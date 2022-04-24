import { JetterSetObject } from './types';
import createStore from './utils/create-store';

export default function jetterSet(attrs: JetterSetObject): JetterSetObject {
  const store = createStore();

  return new Proxy(Object.assign(store, attrs), {
    get(store, prop) {
      return store[prop];
    },
    set(store, prop, val) {
      console.log('[SET] (key/newVal/oldVal)', prop, val, store[prop]);

      if (store.resolvers[prop]) {
        console.warn(
          `${prop.toString()} is a derived property and can not be set directly; if you need to change how this value is calculated use the 'derive' API instead`,
        );
      }

      if (store.derivers.includes(prop)) {
        console.log('--> Is part of deriving a prop');
      }

      if (store.watchers[prop]) {
        console.log('--> Has a watcher');
      }

      return true;
    },
  });
}

const o = jetterSet({
  apples: 2,
  pears: 3,
});

o.derive('fruit', (obj: JetterSetObject) => obj.apples + obj.pears);

console.log('Hot?', o.derivers);

o.apples = 5;

// console.log('Object', o);
// console.log('Derived fruit', o.fruit);

// o.apples = 5;

// console.log('Object', o);
// console.log('Derived fruit', o.fruit);
