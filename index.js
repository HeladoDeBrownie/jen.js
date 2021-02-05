const Rule = class {
    constructor(...clauses) {
        this.clauses = clauses
    }

    evaluate() {
        return randomElement(this.clauses).evaluate()
    }
}

const randomElement = (elements) =>
    elements[randomInteger(0, elements.length - 1)]

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

module.exports = {
    Rule,
    Clause,
}
