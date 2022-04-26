import { JetterSetObject } from '../types';
import createStore from '../create-store';

describe('createStore()', () => {
  const protoProps = ['derivers', 'derivatives', 'history', 'watchers'];
  const protoMethods = ['derive', 'onChange', 'offChange'];

  let store: JetterSetObject;

  beforeEach(() => {
    store = createStore();
  });

  test('is a function returning an object', () => {
    expect(typeof createStore).toEqual('function');
    expect(typeof store).toEqual('object');
    expect(store instanceof Object).toBe(true);
  });

  test('sets a property', () => {
    store.test = 'ok';
    expect(store.test).toEqual('ok');
  });

  test('deletes a property', () => {
    store.test = 'ok';
    delete store.test;
    expect(store.test).toBeUndefined();
  });

  test('contains appropriate props in the prototype chain', () => {
    expect.assertions(protoProps.length);

    protoProps.forEach((prop) => {
      expect(store[prop]).toBeDefined();
    });
  });

  test('contains appropriate methods in the prototype chain', () => {
    expect.assertions(protoMethods.length);

    protoMethods.forEach((method) => {
      expect(store[method]).toBeDefined();
    });
  });

  test('only exposes enumerable props', () => {
    store.key1 = 'ok';
    store.key2 = 12;

    const keys = Object.keys(store);

    expect(keys.length).toEqual(2);
  });
});
