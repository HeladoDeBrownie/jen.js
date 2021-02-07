const {ruleState} = require('./rule-state')

const RuleVariable = class {
    constructor(defaultValue) {
        this.defaultValue = defaultValue
    }

    get() {
        return ruleState.get(this, this.defaultValue)
    }

    set(newValue) {
        ruleState.set(this, newValue)
    }
}

module.exports = {
    RuleVariable,
    ruleState,
}
