const {Backtrack, backtrack} = require('./backtrack')
const {ruleState} = require('./rule-state')

const Rule = class {
    constructor(...clauses) {
        this.clauses = clauses
    }

    evaluate(defaultValue) {
        const isOutermostEvaluation = !ruleState.isInRuleEvaluation()

        // Add an outermost frame before evaluating any clauses in case a
        // weight function needs to use rule variables.
        if (isOutermostEvaluation) {
            ruleState.addFrame()
        }

        const untriedClauses = cloneArray(this.clauses)

        const untriedClauseWeights = untriedClauses.map((clause) =>
            clause.evaluateWeight()
        )

        try {
            while (untriedClauses.length > 0) {
                const clauseToTry = drawWeightedRandomElement(
                    untriedClauses,
                    untriedClauseWeights,
                )

                ruleState.addFrame()

                try {
                    return clauseToTry.evaluate()
                } catch (error) {
                    if (error instanceof Backtrack) {
                        ruleState.removeFrame()
                    } else {
                        throw error
                    }
                }
            }

            if (arguments.length < 1) {
                backtrack('All clauses backtracked.')
            } else {
                return defaultValue
            }
        } finally {
            if (isOutermostEvaluation) {
                ruleState.reset()
            }
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

module.exports = {
    Rule,
    ruleState,
}
