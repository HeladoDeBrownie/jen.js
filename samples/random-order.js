const {Rule, Clause, once} = require('..')

const start = new Rule(new Clause(() =>
    `I like ${shape}, ${shape}, and ${shape}.`
))

const shape = new Rule(
    new Clause(() => { once(); return 'triangles'  }),
    new Clause(() => { once(); return 'rectangles' }),
    new Clause(() => { once(); return 'pentagons'  }),
)

console.log(start.evaluate())
