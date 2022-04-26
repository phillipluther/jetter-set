// import { JetterSetDeriver, JetterSetWatcher } from './types';

const Store = Object.create({
  isDeriving: false,
  // derivers: {},
  derivatives: {},
  history: {},
  watchers: {},

  /**
   *
   */
  derive(derivedProp, deriver) {
    this.derivatives[derivedProp] = deriver;

    // // set a get-trap to capture props composing this derivative
    // const deriveContext = new Proxy(this, {
    //   get(context, derivingProp) {
    //     context.derivers[derivingProp] = context.derivers[derivingProp] || [];
    //     context.derivers[derivingProp].push(derivedProp);

    //     return Reflect.get(context, derivingProp);
    //   },
    // });

    // invoke the deriver function with the proxy as both context and argument, ensuring we
    // pick up props access with either `this.someProp` or `arg.someProp`
    // this[derivedProp] = this.derivatives[derivedProp].call(deriveContext, deriveContext);
    this[derivedProp] = deriver.call(this, this);

    return this;
  },

  /**
   *
   */
  onChange(prop, watcher) {
    console.log('Watching for changes on', prop);

    this.watchers[prop] = this.watchers.prop || [];
    this.watchers[prop].push(watcher.bind(this));

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
});

const store = new Proxy(
  Object.assign(Store, {
    apples: 5,
    pears: 3,
    pecans: 20,
    carrots: 4,
    onions: 2,
  }),
  {
    get(proxiedStore, prop) {
      console.log('get proxy', proxiedStore);
      return Reflect.get(proxiedStore, prop);
    },
    set(proxiedStore, prop, val) {
      if (proxiedStore.derivatives[prop]) {
        console.warn(`${prop} is a derived value`);
      }

      //
      // resolve watchers ...
      //

      return true;
    },
  },
);

console.log('\nthe starting store\n------\n\n', store);

store.derive('fruits', ({ apples, pears }) => apples + pears);
store.derive('pieFodder', ({ apples, pecans }) => apples + pecans);

console.log('> derivatives ...', store.derivatives);
console.log('> watchers ...', store.watchers);

console.log('\n\n------\nthe ending store\n', store, '\n\n');
