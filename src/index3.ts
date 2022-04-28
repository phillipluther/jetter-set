import createJetterSet from './create-jetter-set';

const d = createJetterSet({
  apples: 3,
  pears: 2,
  carrots: 5,
  onions: 2,
});

console.log('\n\n------\nBeginning\n', d, '\n\n');

d.derive('fruit', (obj) => obj.apples + obj.pears);

d.apples = 5;
d.pears = 99;

d.derive('veggies', ({ carrots, onions }) => carrots + onions);

d.onions = 10;

console.log('\n\nEnding\n------\n', d, '\n\nWatchers', d.watchers, '\n\n');
