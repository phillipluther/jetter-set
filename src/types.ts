export type JetterSetStoreKey = symbol | string;
export type JetterSetPropHandler = (store: JetterSetStore) => any;
export type JetterSetStoreMethod = (
  prop: JetterSetStoreKey,
  handler: JetterSetPropHandler,
) => JetterSetStore;

export interface JetterSetStore {
  derivatives: Set<JetterSetStoreKey>;
  watchers: { [key: JetterSetStoreKey]: JetterSetPropHandler[] };
  derive: JetterSetStoreMethod;
  onChange: JetterSetStoreMethod;
  offChange: JetterSetStoreMethod;
  [key: JetterSetStoreKey]: any;
}
