import { JetterSetDeriver, JetterSetWatcher } from './types';

export default function createStore() {
  const store = Object.create({
    derivers: {},
    derivatives: {},
    history: {},
    watchers: {},

    /**
     *
     */
    derive(derivedProp: string, handler: JetterSetDeriver) {
      // set a .get trap so we can grab properties used to create derived properties
      const proxyContext = new Proxy(store, {
        get(proxiedStore, derivingProp) {
          if (Object.hasOwnProperty.call(proxiedStore, derivingProp)) {
            proxiedStore.derivers[derivingProp] = proxiedStore.derivers[derivingProp] || [];
            proxiedStore.derivers[derivingProp].push(derivedProp);
          }

          return store[derivingProp];
        },
      });

      store.derivatives[derivedProp] = handler;
      // invoke the handler with the proxy as both context and argument, ensuring we capture
      // property access via `arg.prop` and `this.prop`
      store[derivedProp] = handler.call(proxyContext, proxyContext);

      return store;
    },

    /**
     *
     */
    onChange(prop: string, handler: JetterSetWatcher) {
      const { watchers } = store;

      watchers[prop] = watchers[prop] || [];
      watchers[prop].push(handler);

      return store;
    },

    /**
     *
     */
    offChange(prop: string, handler: JetterSetWatcher) {
      const { watchers } = store;
      watchers[prop] = watchers[prop].filter((h: JetterSetWatcher) => h !== handler);

      return store;
    },
  });

  return store;
}
