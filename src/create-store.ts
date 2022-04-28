import { JetterSetStoreKey, JetterSetStore } from './types';

export default function createStore(props: { [key: string]: any } = {}): JetterSetStore {
  const Store: JetterSetStore = Object.create({
    derivatives: new Set(),
    watchers: {},
    derive(prop, handler) {
      const derivingProps: JetterSetStoreKey[] = [];
      const derivingContext = new Proxy(Store, {
        get(obj, prop) {
          derivingProps.push(prop);
          return Reflect.get(obj, prop);
        },
      });

      Store.derivatives.add(prop);

      Store[prop] = handler.call(derivingContext, derivingContext);

      derivingProps.forEach((derivingProp) => {
        Store.onChange(derivingProp, (store) => {
          store[prop] = handler.call(store, store);
        });
      });

      return Store;
    },
    onChange(prop, handler) {
      Store.watchers[prop] = Store.watchers[prop] || [];
      Store.watchers[prop].push(handler);

      return Store;
    },
    offChange(prop, handler) {
      if (Store.watchers[prop]) {
        Store.watchers[prop] = Store.watchers[prop].filter((h) => h !== handler);
      }

      return Store;
    },
  } as JetterSetStore);

  return Object.assign(Store, props);
}
