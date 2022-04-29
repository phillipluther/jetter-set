import { JetterSetKey, JetterSet } from './types';

export function jetterSet(props: { [key: string]: any }) {
  const Store: JetterSet = Object.create({
    derivatives: new Set(),
    watchers: {},
    derive(prop, handler) {
      const derivingProps: JetterSetKey[] = [];
      const derivingContext = new Proxy(Store, {
        get(obj, prop) {
          derivingProps.push(prop);
          return Reflect.get(obj, prop);
        },
      });

      Store.derivatives.add(prop);

      Store[prop] = handler.call(derivingContext, derivingContext);

      derivingProps.forEach((derivingProp) => {
        Store.onChange(derivingProp, (newVal, oldVal, store) => {
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
  } as JetterSet);

  const store = Object.assign(Store, props);

  return new Proxy(store, {
    set(obj, prop, val) {
      const oldVal = obj[prop];

      // noop on no update
      if (val === oldVal) {
        return true;
      }

      if (obj.derivatives.has(prop)) {
        console.warn(
          `"${prop.toString()}" is a derived property; its value of ${val} will be overwritten when deriving props change`,
        );
      }

      obj[prop] = val;

      if (obj.watchers[prop]) {
        obj.watchers[prop].forEach((handler) => {
          handler.call(obj, val, oldVal, obj);
        });
      }

      return true;
    },
  });
}
