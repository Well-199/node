const { checkSchema } = require('express-validator')

const UserValidator = {

    editAction: checkSchema({
        token: {
            notEmpty: true
        },
        name: {
            optional: true,
            trim: true,
            notEmpty: true,
            isLength: {
                options: { min: 3 }
            },
            errorMessage: 'Nome precisa ter pelo menos 3 caracteres'
        },
        email: {
            optional: true,
            isEmail: true,
            normalizeEmail: false,
            errorMessage: 'E-mail inválido'
        },
        password: {
            optional: true,
            isLength: {
                options: { min: 2 }
            },
            errorMessage: 'Senha precisar ter pelo menos 2 caracteres'
        },
        state: {
            optional: true,
            notEmpty: true,
            errorMessage: 'Estado não preenchido'
        }
    })
}

module.exports = UserValidator