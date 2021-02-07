const Clause = class {
    constructor(value, {weight = 1} = {}) {
        if (arguments.length < 1) {
            throw new TypeError('Clause value must be provided.')
        }

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
