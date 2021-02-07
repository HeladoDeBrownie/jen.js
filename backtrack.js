const Backtrack = class extends Error {
    constructor(message) {
        super(message === undefined ? 'A backtrack was signaled.'
                                    : `A backtrack was signaled: ${message}`)
    }
}

const backtrack = (message) => { throw new Backtrack(message) }

module.exports = {
    Backtrack,
    backtrack,
}
