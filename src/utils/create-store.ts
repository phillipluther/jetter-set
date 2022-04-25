import { JetterSetDeriver, JetterSetWatcher } from '../types';

export default function createStore() {
  const store = Object.create({
    derivers: {},
    derivatives: {},
    history: {},
    watchers: {},
    derive(derivedProp: string, handler: JetterSetDeriver) {
      // capture any asks of the store so we can map derivers
      const getTrappedStore = new Proxy(store, {
        get(obj, deriver) {
          if (Object.hasOwnProperty.call(store, deriver)) {
            store.derivers[deriver] = store.derivers[deriver] || [];
            store.derivers[deriver].push(derivedProp);
          }

          return obj[deriver];
        },
      });

      store.derivatives[derivedProp] = handler;
      store[derivedProp] = handler.call(getTrappedStore, getTrappedStore);

      return store;
    },
    onChange(prop: string, handler: JetterSetWatcher) {
      const { watchers } = store;

      watchers[prop] = watchers[prop] || [];
      watchers[prop].push(handler);

      return store;
    },
    offChange(prop: string, handler: JetterSetWatcher) {
      const { watchers } = store;
      watchers[prop] = watchers[prop].filter((h: JetterSetWatcher) => h !== handler);

      return store;
    },
  });

  return store;
}
