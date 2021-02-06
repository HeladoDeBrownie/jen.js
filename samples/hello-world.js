const {Rule, Clause} = require('..')

const start = new Rule(new Clause({value: () => `${hello} ${world}`}))

const hello = new Rule(
    new Clause({value: 'hello', weight: 3}),
    new Clause({value: 'hewwo', weight: 1}),
)

const world = new Rule(
    new Clause({value: 'world', weight: 3}),
    new Clause({value: 'wowwd', weight: 1}),
)

console.log(start.evaluate())
