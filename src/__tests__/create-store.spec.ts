import { JetterSetStore, JetterSetPropHandler } from '../types';
import createStore from '../create-store';

describe('createStore()', () => {
  let store: JetterSetStore;
  let changeSpy: jest.SpyInstance;

  const testData = {
    apples: 3,
    pears: 2,
    carrots: 5,
    onions: 2,
  };

  beforeEach(() => {
    store = createStore(testData);
    store.derive('fruits', (obj) => obj.apples + obj.pears);

    changeSpy = jest.fn();
  });

  test('returns an object', () => {
    expect(typeof createStore).toEqual('function');
    expect(typeof store).toEqual('object');
    expect(store instanceof Object).toBe(true);
  });

  test('does not require default props', () => {
    store = createStore();
    expect(Object.keys(store)).toHaveLength(0);
  });

  test('derived properties are indistinguishable from static props', () => {
    const keys = Object.keys(store);

    expect(store.fruits).toEqual(5);
    expect(keys.length).toEqual(5);
    expect(keys.includes('fruits')).toBe(true);
  });

  test('keeps track of derived properties', () => {
    store.derive('other', () => null);

    expect(store.derivatives.has('fruits')).toBe(true);
    expect(store.derivatives.has('other')).toBe(true);
  });

  test('watches deriving props for updates', () => {
    expect(store.watchers.apples).toBeDefined();
    expect(store.watchers.apples).toHaveLength(1);

    expect(store.watchers.pears).toBeDefined();
    expect(store.watchers.pears).toHaveLength(1);
  });

  test('creates a watcher to update derived values on deriving prop changes', () => {
    store.apples = 10;
    store.watchers.apples[0](store);

    expect(store.fruits).toEqual(12);
  });

  test('can watch for prop changes', () => {
    store.onChange('onions', (obj) => obj);
    expect(store.watchers.onions).toHaveLength(1);
  });

  test('can unwatch prop changes', () => {
    const watcher1: JetterSetPropHandler = (obj) => obj;
    const watcher2: JetterSetPropHandler = (obj) => obj;

    store.onChange('onions', watcher1);
    store.onChange('onions', watcher2);

    expect(store.watchers.onions).toHaveLength(2);

    store.offChange('onions', watcher2);
    expect(store.watchers.onions).toHaveLength(1);
  });
});
