const {Rule, Clause, RuleVariable} = require('..')

const isKitten = new RuleVariable(false)

const start = new Rule(new Clause({value: () =>
    `A playful ${cat} plays with you${maybeKittenishly}!`
}))

const cat = new Rule(
    new Clause({value: 'cat'}),

    new Clause({value: () => {
        isKitten.set(true)
        return 'kitten'
    }}),
)

const maybeKittenishly = new Rule(
    new Clause({value: '',             weight: () => isKitten.get() ? 1 : 7}),
    new Clause({value: ' kittenishly', weight: () => isKitten.get() ? 7 : 1}),
)

console.log(start.evaluate())
