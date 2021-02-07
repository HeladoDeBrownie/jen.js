const {Rule, Clause} = require('..')

const start = new Rule(new Clause(() => `${hello} ${world}`))

const hello = new Rule(
    new Clause('hello', {weight: 3}),
    new Clause('hewwo', {weight: 1}),
)

const world = new Rule(
    new Clause('world', {weight: 3}),
    new Clause('wowwd', {weight: 1}),
)

console.log(start.evaluate())
