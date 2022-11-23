export type JetterSetKey = symbol | string;

export type JetterSetChangeHandler = (newVal: unknown, oldVal: unknown, store: JetterSet) => unknown;
export type JetterSetDerivativeHandler = (store: JetterSet) => void;

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
