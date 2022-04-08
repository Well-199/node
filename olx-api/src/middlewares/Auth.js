const User = require('../models/User')

const Auth = {

    async private (req, res, next) {

        // Se não veio na query nem no body nao existe token
        if(!req.query.token && !req.body.token){
            res.json({ notallowed: true })
            return
        }
        
        let token = ''

        // Se veio na query eu pego o token aqui
        if(req.query.token){
            token = req.query.token
        }

        // se veio no body eu pego o token aqui
        if(req.body.token){
            token = req.body.token
        }

        // se o token que eu peguei ta vazio eu paro a requisição aqui
        if(token == ''){
            res.json({ notallowed: true })
            return
        }

        // Se existe token e não ta vazio eu faço a busca pelo token no banco
        const user = await User.findOne({token: token})

        // se não foi encontrado um token igual no banco paro a requisiçao aqui
        if(!user){
            res.json({notallowed: true})
            return
        }

        // se foi encontrado um token valido no banco eu prossigo com a requisição
        next()
    }

}

module.exports = Auth