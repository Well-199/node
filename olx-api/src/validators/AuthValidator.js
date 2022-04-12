const { checkSchema } = require('express-validator')

const AuthValidator = {

    signup: checkSchema({
        name: {
            trim: true,
            notEmpty: true,
            isLength: {
                options: { min: 3 }
            },
            errorMessage: 'Nome precisa ter pelo menos 3 caracteres'
        },
        email: {
            isEmail: true,
            normalizeEmail: false,
            errorMessage: 'E-mail inválido'
        },
        password: {
            isLength: {
                options: { min: 2 }
            },
            errorMessage: 'Senha precisar ter pelo menos 2 caracteres'
        },
        state: {
            notEmpty: true,
            errorMessage: 'Estado não preenchido'
        }
    }),
    signin: checkSchema({
        email: {
            isEmail: true,
            normalizeEmail: false,
            errorMessage: 'E-mail inválido'
        },
        password: {
            isLength: {
                options: { min: 2 }
            },
            errorMessage: 'Senha precisar ter pelo menos 2 caracteres'
        }
    })
}

module.exports = AuthValidator