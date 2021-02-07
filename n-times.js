const {backtrack} = require('./backtrack')
const {RuleVariable} = require('./rule-variable')
const {ruleState} = require('./rule-state')
const countVariableMap = new Map()

const nTimes = (numberOfTimesPermitted) => {
    const clause = ruleState.getCurrentClause()
    
    if (!countVariableMap.has(clause)) {
        countVariableMap.set(clause, new RuleVariable(0))
    }

    const countVariable = countVariableMap.get(clause)
    const count = countVariable.get()

    if (count >= numberOfTimesPermitted) {
        backtrack(
            'Clause has already been committed to the maximum number of times.'
        )
    } else {
        countVariable.set(count + 1)
    }
}

const once = () => nTimes(1)

module.exports = {
    nTimes,
    once,
}
