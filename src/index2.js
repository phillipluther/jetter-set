// import { JetterSetDeriver, JetterSetWatcher } from './types';
const attrs = {
  apples: 5,
  pears: 3,
  pecans: 20,
  carrots: 4,
  onions: 2,
};

let _isDeriving = false;
let _derivingProps = [];

const store = new Proxy(
  Object.assign(
    Object.create({
      derivatives: [],
      history: {},
      watchers: {},

      /**
       *
       */
      derive(derivedProp, deriver) {
        _isDeriving = true;
        // this.derivatives[derivedProp] = deriver;

        // invoke the deriver function with the proxy as both context and argument, ensuring we
        // pick up props access with either `this.someProp` or `arg.someProp`
        // this[derivedProp] = this.derivatives[derivedProp].call(deriveContext, deriveContext);
        this[derivedProp] = deriver.call(this, this);

        if (this.derivatives.includes(derivedProp) === false) {
          this.derivatives.push(derivedProp);
        }

        _derivingProps.forEach((prop) => {
          this.onChange(prop, () => {
            _isDeriving = true;
            this[derivedProp] = deriver.call(this, this);
            _isDeriving = false;
          });
        });

        _isDeriving = false;
        _derivingProps = [];

        return this;
      },

      /**
       *
       */
      onChange(prop, watcher) {
        // console.log('Watching for changes on', prop);

        this.watchers[prop] = this.watchers[prop] || [];
        this.watchers[prop].push(watcher);

        return this;
      },

      /**
       *
       */
      offChange(prop, watcher) {
        console.log('Ignoring changes on', prop);

        if (this.watchers[prop]) {
          this.watchers[prop] = this.watchers[prop].filter((f) => f !== watcher);

          if (this.watchers[prop].length === 0) {
            delete this.watchers[prop];
          }
        }

        return this;
      },
    }),
    attrs,
  ),
  {
    get(proxiedStore, prop) {
      if (_isDeriving && Object.hasOwnProperty.call(proxiedStore, prop)) {
        _derivingProps.push(prop);
      }

      return Reflect.get(proxiedStore, prop);
    },
    set(proxiedStore, prop, val) {
      if (proxiedStore.derivatives.includes(prop) && !_isDeriving) {
        console.warn(
          `[jetterSet] Fair warning! '${prop}' is a derived prop; it will be overwritten if deriving values change`,
        );
      }

      proxiedStore[prop] = val;

      if (proxiedStore.watchers[prop]) {
        proxiedStore.watchers[prop].forEach(function (watcherAction) {
          watcherAction.call(proxiedStore, proxiedStore);
        });
      }

      return true;
    },
  },
);

console.log('\nthe starting store\n------\n', store, '\n\n');

store.derive('fruits', ({ apples, pears }) => apples + pears);
store.derive('pieFodder', ({ apples, pecans }) => apples + pecans);

// console.log('> derivatives ...', store.derivatives);
// console.log('> watchers ...', store.watchers);

store.pears = 8;
// store.pieFodder = 11;

console.log('\n\n------\nthe ending store\n', store, '\n\n');
