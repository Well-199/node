const { validationResult, matchedData } = require('express-validator')

const AuthController = {

    async signin (req, res){

        res.json("ok")
    },

    async signup (req, res){

        const errors = validationResult(req)

        if(!errors.isEmpty()){
            res.json({error: errors.mapped()})
            return
        }

        const data = matchedData(req)

        res.json({ result: true, data: data })
    },

}

module.exports = AuthController