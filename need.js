const {backtrack} = require('./backtrack')

const need = (truthValue, message) => {
    if (!truthValue) {
        backtrack(arguments.length >= 2 ?
            message :
            'The required clause condition was not met.'
        )
    }
}

module.exports = {
    need,
}
