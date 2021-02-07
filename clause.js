const Clause = class {
    constructor({value, weight = 1}) {
        this.evaluate =
            typeof value === 'function' ? value
                                        : () => value

        this.evaluateWeight =
            typeof weight === 'function' ? weight
                                         : () => weight
    }
}

module.exports = {
    Clause,
}
