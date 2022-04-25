export type JetterSetObject = { [key: string]: any };
export type JetterSetDeriver = (store: JetterSetObject) => any;
export type JetterSetWatcher = (newVal?: any, oldVal?: any, store?: JetterSetObject) => any;
