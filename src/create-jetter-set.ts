import { JetterSetObject, JetterSetWatcher } from './types';
import createStore from './create-store';

export default function jetterSet(attrs: JetterSetObject = {}): JetterSetObject {
  const store = createStore();

  return new Proxy(Object.assign(store, attrs), {
    set(store, prop, val) {
      if (store.derivatives[prop]) {
        console.warn(
          '[jetterSet]',
          `${prop.toString()} is a derived property and can not be set directly`,
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
