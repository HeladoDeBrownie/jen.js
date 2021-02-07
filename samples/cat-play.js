const {Rule, Clause, RuleVariable} = require('..')

const isKitten = new RuleVariable(false)

const start = new Rule(new Clause(() =>
    `A playful ${cat} plays with you${maybeKittenishly}!`
))

const cat = new Rule(
    new Clause('cat'),

    new Clause(() => {
        isKitten.set(true)
        return 'kitten'
    }),
)

const maybeKittenishly = new Rule(
    new Clause(''            , {weight: () => isKitten.get() ? 1 : 7}),
    new Clause(' kittenishly', {weight: () => isKitten.get() ? 7 : 1}),
)

console.log(start.evaluate())
