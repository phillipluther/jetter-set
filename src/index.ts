import { JetterSetKey, JetterSet, JetterSetChangeHandler } from './types';

export function jetterSet(props: { [key: string]: unknown }) {
  const createSetTrap =
    (isSilent = false) =>
      (obj: JetterSet, prop: string, val: unknown) => {
        const oldVal = obj[prop];

        // noop on no update
        if (val === oldVal) {
          return true;
        }

        if (!isSilent && obj.derivatives.has(prop)) {
          console.warn(
            `"${prop.toString()}" is a derived property; its value of ${val} will be overwritten when deriving props change`,
          );
        }

        obj[prop] = val;

        if (obj.watchers[prop]) {
          obj.watchers[prop].forEach((handler: JetterSetChangeHandler) => {
            handler.call(obj, val, oldVal, obj);
          });
        }

        return true;
      };

  const store = Object.assign(
    Object.create({
      derivatives: new Set(),
      watchers: {},
      derive(prop, handler) {
        this.derivatives.add(prop);

        const derivingProps: JetterSetKey[] = [];
        const derivingContext = new Proxy(store, {
          get(obj, prop) {
            derivingProps.push(prop);
            return Reflect.get(obj, prop);
          },
          set: createSetTrap(true),
        });

        derivingContext[prop] = handler.call(derivingContext, derivingContext);

        derivingProps.forEach((derivingProp) => {
          this.onChange(derivingProp, () => {
            derivingContext[prop] = handler.call(this, this);
          });
        });

        return this;
      },
      onChange(prop, handler) {
        this.watchers[prop] = this.watchers[prop] || [];
        this.watchers[prop].push(handler);

        return this;
      },
      offChange(prop, handler) {
        if (this.watchers[prop]) {
          this.watchers[prop] = this.watchers[prop].filter((h) => h !== handler);
        }

        return this;
      },
    } as JetterSet),
    props,
  );

  return new Proxy(store, {
    set: createSetTrap(),
  });
}
