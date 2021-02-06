const RuleState = class {
    constructor() {
        this.stack = []
        this.stack[Symbol.iterator] = reverseIterator
    }

    addFrame() {
        this.stack.push(new Map())
    }

    removeFrame() {
        this.assertIsInRuleEvaluation()
        this.stack.pop()
    }

    get(key, defaultValue) {
        this.assertIsInRuleEvaluation()

        for (const frame of this.stack) {
            if (frame.has(key)) {
                return frame.get(key)
            }
        }

        if (arguments.length >= 2) {
            return defaultValue
        } else {
            throw new RuleStateUninitializedError
        }
    }

    set(key, newValue) {
        this.assertIsInRuleEvaluation()
        this.stack[this.stack.length - 1].set(key, newValue)
    }

    isInRuleEvaluation() {
        return this.stack.length > 0
    }

    assertIsInRuleEvaluation() {
        if (!this.isInRuleEvaluation()) {
            throw new RuleStateAccessError
        }
    }
}

const reverseIterator = function*() {
    for (let index = this.length - 1; index >= 0; index--) {
        yield this[index]
    }
}

const RuleStateUninitializedError = class extends Error {
    constructor() {
        super(`Cannot access an uninitialized rule variable.`)
    }
}

const RuleStateAccessError = class extends Error {
    constructor() {
        super(`Cannot access rule state outside of rule evaluation.`)
    }
}

const ruleState = new RuleState()

const Rule = class {
    constructor(...clauses) {
        this.clauses = clauses
    }

    evaluate(defaultValue) {
        // Add an outermost frame before evaluating any clauses in case a
        // weight function needs to use rule variables.
        if (!ruleState.isInRuleEvaluation()) {
            ruleState.addFrame()
        }

        const untriedClauses = cloneArray(this.clauses)

        const untriedClauseWeights = untriedClauses.map((clause) =>
            clause.evaluateWeight()
        )

        while (untriedClauses.length > 0) {
            const clauseToTry = drawWeightedRandomElement(
                untriedClauses,
                untriedClauseWeights,
            )

            ruleState.addFrame()

            try {
                return clauseToTry.evaluate()
            } catch (error) {
                if (!(error instanceof Backtrack)) {
                    throw error
                }
            } finally {
                ruleState.removeFrame()
            }
        }

        if (arguments.length < 1) {
            backtrack('All clauses backtracked.')
        } else {
            return defaultValue
        }
    }

    // This is a hack to allow subrule evaluation to be more succinct.
    toString() {
        return this.evaluate()
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
