const RuleState = class {
    constructor() {
        this.stack = []
        this.stack[Symbol.iterator] = reverseIterator
    }

    addFrame() {
        this.stack.push(new Map())
    }

    removeFrame() {
        this.stack.pop()
    }

    reset() {
        this.stack.length = 0
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

const reverseIterator = function* () {
    for (let index = this.length - 1; index >= 0; index--) {
        yield this[index]
    }
}

const RuleStateAccessError = class extends Error {
    constructor() {
        super('Cannot access rule state outside of rule evaluation.')
    }
}

const RuleStateUninitializedError = class extends Error {
    constructor() {
        super('Cannot access an uninitialized rule variable.')
    }
}

const ruleState = new RuleState()

module.exports = {
    RuleState,
    RuleStateAccessError,
    RuleStateUninitializedError,
    ruleState,
}
