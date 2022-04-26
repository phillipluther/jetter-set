import { JetterSetObject } from './types';
import jetterSet from './create-jetter-set';

const o = jetterSet({
  apples: 2,
  pears: 3,
  carrots: 6,
  onions: 2,
});

o.derive('fruit', (obj: JetterSetObject) => {
  return obj.apples + obj.pears;
});

o.onChange('carrots', (newVal: number) => {
  if (newVal < 2) {
    console.log('\n> Buy more carrots!\n');
  }
});

const fruitChanger = (newVal: number, oldVal: number) => {
  console.log('\n> Nice fruit update:', `from ${oldVal} to ${newVal}\n`);
};

o.onChange('fruit', fruitChanger);

console.log('\n\n-----\nBeginning\n', o);

// o.fruit = 99;

// console.log('Derivers', o.derivers);
// console.log('gimme carrots', o.carrots);
// console.log('New derivers', o.derivers);

o.apples = 5;
o.carrots = 1;
o.pears = 10;

o.offChange('fruit', fruitChanger);

o.apples = 99;
// console.log('Object', o);
// console.log('Derived fruit', o.fruit);
console.log('\n\n-----\nEnding\n', o);

console.log('Watchers', o.watchers);
