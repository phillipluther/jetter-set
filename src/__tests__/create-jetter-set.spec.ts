import { JetterSetStore, JetterSetPropHandler } from '../types';
import createJetterSet from '../create-jetter-set';

describe('createStore()', () => {
  let jetterSet: JetterSetStore;
  let warnSpy: jest.SpyInstance;
  let warning: string;
  let changeSpy: jest.SpyInstance;

  beforeEach(() => {
    jetterSet = createJetterSet({
      apples: 3,
      pears: 2,
      somethingElse: true,
    });

    changeSpy = jest.fn();

    jetterSet.derive('fruits', (obj) => obj.apples + obj.pears);
    jetterSet.onChange('apples', changeSpy as unknown as JetterSetPropHandler);

    warnSpy = jest.spyOn(console, 'warn').mockImplementation((val) => {
      warning = val;
      return null;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('returns seemingly normal JavaScript object', () => {
    expect(typeof jetterSet).toEqual('object');
    expect(jetterSet instanceof Object).toBe(true);
  });

  test('warns on directly setting derived props', () => {
    jetterSet.fruits = 1;

    expect(warnSpy).toHaveBeenCalledTimes(1);

    // whatever the error message is, it should contain the prop, val, and "derived property"
    expect(warning).toContain('fruits');
    expect(warning).toContain('1');
    expect(warning).toContain('derived property');
  });

  test('fires change handlers for watched props', () => {
    jetterSet.apples = 9;

    expect(changeSpy).toHaveBeenCalledTimes(1);
    expect(changeSpy).toHaveBeenCalledWith(jetterSet);
  });

  test('only takes action for changed values', () => {
    jetterSet.apples = 9;
    jetterSet.apples = 9;
    jetterSet.apples = 9;

    expect(changeSpy).toHaveBeenCalledTimes(1);
  });
});
