import createStore from './create-store';

export default function createJetterSet(props: { [key: string]: any }) {
  const store = createStore(props);

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
          handler.call(obj, obj);
        });
      }

      return true;
    },
  });
}
