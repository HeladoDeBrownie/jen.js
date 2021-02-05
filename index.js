const Rule = class {
    constructor(...clauses) {
        this.clauses = clauses
    }

    evaluate(defaultValue) {
        const untriedClauses = cloneArray(this.clauses)

        const untriedClauseWeights = untriedClauses.map((clause) =>
            clause.evaluateWeight()
        )

        while (untriedClauses.length > 0) {
            const clauseToTry = drawWeightedRandomElement(
                untriedClauses,
                untriedClauseWeights,
            )

            try {
                return clauseToTry.evaluate()
            } catch (error) {
                if (!(error instanceof Backtrack)) {
                    throw error
                }
            }
        }

        if (arguments.length < 1) {
            backtrack('All clauses backtracked.')
        } else {
            return defaultValue
        }
    }
}

const cloneArray = (array) => array.slice()

const drawWeightedRandomElement = (elements, weights) => {
    // Precondition: elements and weights are of the same length, all weights
    // are natural numbers.

    const weightSum = weights.reduce((sumSoFar, weight) => sumSoFar + weight)
    const randomPartialWeightSum = randomInteger(0, weightSum - 1)
    let currentIndex = -1
    let weightSumSoFar = 0

    do {
        currentIndex++
        weightSumSoFar += weights[currentIndex]
    } while (weightSumSoFar <= randomPartialWeightSum)

    weights.splice(currentIndex, 1)
    return elements.splice(currentIndex, 1)[0]
}

const randomInteger = (minimum, maximum) =>
    // Precondition: minimum and maximum are integers, maximum > minimum.
    Math.floor(Math.random() * (maximum - minimum + 1) + minimum)

const Clause = class {
    constructor({value, weight}) {
        this.evaluate =
            typeof value === 'function' ? value
                                        : () => value

        this.evaluateWeight =
            typeof weight === 'function' ? weight
                                         : () => weight
    }
}

const backtrack = (message) => { throw new Backtrack(message) }

const Backtrack = class extends Error {
    constructor(message) {
        super(message === undefined ? 'A backtrack was signaled.'
                                    : `A backtrack was signaled: ${message}`)
    }
}

module.exports = {
    Rule,
    Clause,
    backtrack,
    Backtrack,
}
