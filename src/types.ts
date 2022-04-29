export type JetterSetKey = symbol | string;

export type JetterSetChangeHandler = (newVal: any, oldVal: any, store: JetterSet) => any;
export type JetterSetDerivativeHandler = (store: JetterSet) => any;

export type JetterSetWatcher = (prop: JetterSetKey, handler: JetterSetChangeHandler) => JetterSet;

export type JetterSetDeriver = (
  prop: JetterSetKey,
  handler: JetterSetDerivativeHandler,
) => JetterSet;

export interface JetterSet {
  derivatives: Set<JetterSetKey>;
  watchers: { [key: JetterSetKey]: JetterSetChangeHandler[] };
  derive: JetterSetDeriver;
  onChange: JetterSetWatcher;
  offChange: JetterSetWatcher;
  [key: JetterSetKey]: any;
}
