const Rule = class {
    constructor(...clauses) {
        this.clauses = clauses
    }

    evaluate(defaultValue) {
        let untriedClauses = cloneArray(this.clauses)

        while (untriedClauses.length > 0) {
            const clauseToTry = drawRandomElement(untriedClauses)

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

const drawRandomElement = (array) => {
    const randomIndex = randomInteger(0, array.length - 1)
    return array.splice(randomIndex, 1)[0]
}

const randomInteger = (minimum, maximum) =>
    // Precondition: minimum and maximum are integers, maximum > minimum.
    Math.floor(Math.random() * (maximum - minimum + 1) + minimum)

const Clause = class {
    constructor(value) {
        this.evaluate =
            typeof value === 'function' ? value
                                        : () => value
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
