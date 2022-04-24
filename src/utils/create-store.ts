import { JetterSetHandler } from '../types';

export default function createStore() {
  const store = new Proxy(
    Object.create({
      derivers: [],
      resolvers: {},
      watchers: {},
      derive(prop: string, handler: JetterSetHandler) {
        store.resolvers[prop] = handler;
        store[prop] = handler.call(store, store);
      },
      onChange(prop: string, handler: JetterSetHandler) {
        const { watchers } = store;

        watchers[prop] = watchers[prop] || [];
        watchers[prop].push(handler);
      },
      offChange(prop: string, handler: JetterSetHandler) {
        const { watchers } = store;
        watchers[prop] = watchers[prop].filter((h: JetterSetHandler) => h !== handler);
      },
      resolve(prop?: string) {
        const { resolvers } = store;

        if (prop) {
          store[prop] = resolvers[prop].call(store, store);
        } else {
          for (const prop in resolvers) {
            store[prop] = resolvers[prop].call(store, store);
          }
        }

        return store;
      },
    }),
    {
      get(obj, prop) {
        if (Object.hasOwnProperty.call(store, prop)) {
          store.derivers.push(prop);
        }

        return obj[prop];
      },
    },
  );

  return store;
}
