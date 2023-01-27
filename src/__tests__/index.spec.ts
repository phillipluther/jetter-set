import { JetterSet, JetterSetChangeHandler, JetterSetDerivativeHandler } from '../types';
import { jetterSet } from '../index';

describe('jetterSet()', () => {
  const testData = {
    apples: 3,
    pears: 2,
    carrots: 5,
    onions: 2,
  };

  let store: JetterSet;
  let changeSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;
  let warning: string | null;

  beforeEach(() => {
    store = jetterSet(testData);
    store.derive('fruits', (obj) => obj.apples + obj.pears);

    changeSpy = jest.fn();
    store.onChange('apples', changeSpy as unknown as JetterSetChangeHandler);

    warnSpy = jest.spyOn(console, 'warn').mockImplementation((val) => {
      warning = val;
      return null;
    });

    warning = null;
  });

  test('returns seemingly normal JavaScript object', () => {
    expect(typeof store).toEqual('object');
    expect(store instanceof Object).toBe(true);
  });

  test('warns on directly setting derived props', () => {
    store.fruits = 1;

    expect(warnSpy).toHaveBeenCalledTimes(1);

    // whatever the error message is, it should contain the prop, val, and "derived property"
    expect(warning).toContain('fruits');
    expect(warning).toContain('1');
    expect(warning).toContain('derived property');
  });

  test('fires change handlers for watched props', () => {
    store.apples = 9;

    expect(changeSpy).toHaveBeenCalledTimes(1);
    expect(changeSpy).toHaveBeenCalledWith(9, 3, store);
  });

  test('fires change handlers for derived props', () => {
    store.onChange('fruits', changeSpy as unknown as JetterSetChangeHandler);
    store.pears = 3;

    expect(changeSpy).toHaveBeenCalledTimes(1);
    expect(changeSpy).toHaveBeenCalledWith(6, 5, store);
  });

  test('only takes action when values change', () => {
    store.apples = 9;
    store.apples = 9;
    store.apples = 9;

    expect(changeSpy).toHaveBeenCalledTimes(1);
  });

  test('passes store param to derivation handlers', () => {
    store.derive('anything', changeSpy as unknown as JetterSetDerivativeHandler);
    expect(changeSpy).toHaveBeenCalledWith(store);
  });

  test('derives props', () => {
    expect(store.fruits).toEqual(5);
  });

  test('updates derivative props when upstream values change', () => {
    store.apples = 9;
    expect(store.fruits).toEqual(11);
  });

  test('recognizes deriving props when destructured', () => {
    store.derive('veggies', ({ carrots, onions }) => carrots + onions);
    expect(store.veggies).toEqual(7);

    store.carrots = 10;
    store.onions = 10;
    expect(store.veggies).toEqual(20);
  });

  test('removes change handlers', () => {
    store.offChange('apples', changeSpy as unknown as JetterSetChangeHandler);
    store.apples = 99;

    expect(changeSpy).toHaveBeenCalledTimes(0);
    expect(store.watchers.apples).toHaveLength(1); // 1 left from the derivative

    // speaking of, ensure the derivative is still hooked up. if so, we removed the right one
    expect(store.fruits).toEqual(101);
  });

  test('uses derived values as signals', () => {
    store.derive('veggies', ({ carrots, onions }) => carrots + onions);
    store.derive('produce', ({ fruits, veggies }) => fruits + veggies);

    expect(store.produce).toEqual(12);

    store.carrots = 10;
    expect(store.produce).toEqual(17);

    store.apples = 10;
    expect(store.produce).toEqual(24);
  });

  test('memoizes derived values', () => {
    const memoSpy = jest.fn();

    store.derive('veggies', ({ carrots, onions }) => {
      memoSpy();
      return carrots + onions;
    });

    store.veggies + store.veggies + store.veggies;
    expect(memoSpy).toHaveBeenCalledTimes(1);

    store.carrots = 0;

    expect(memoSpy).toHaveBeenCalledTimes(2);
  });
});
