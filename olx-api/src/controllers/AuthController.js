const { validationResult, matchedData } = require('express-validator')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const User = require('../models/User')
const State = require('../models/State')

const AuthController = {

    async signin (req, res){

        const errors = validationResult(req)
        if(!errors.isEmpty()){
            res.json({error: errors.mapped()})
            return
        }
        const data = matchedData(req)

        // Validando a senha
        const user = await User.findOne({email: data.email})
        if(!user){
            res.json({error: 'E-mail e/ou senha errados'})
            return
        }

        // Validando a senha
        const match = await bcrypt.compare(data.password, user.password)
        if(!match){
            res.json({error: 'E-mail e/ou senha errados'})
            return
        }

        // Gera um token de sessão para o usuario logado
        const payload = (Date.now() + Math.random()).toString()
        const token = await bcrypt.hash(payload, 10)

        // istancia o objeto com a propriedade token
        user.token = token
        await user.save()

        res.json({data: token})
    },

    async signup (req, res){

        const errors = validationResult(req)
        if(!errors.isEmpty()){
            res.json({error: errors.mapped()})
            return
        }
        const data = matchedData(req)

        const user = await User.findOne({email: data.email})

        if(user){
            res.json({error: 'E-mail já cadastrado'})
            return
        }

        if(mongoose.Types.ObjectId.isValid(data.state)){
            const state = await State.findById(data.state)

            if(!state){
                res.json({error: 'Estado não existe'})
                return
            }
        }
        else{
            res.json({error: 'Código de estado inválido'})
            return
        }

        const passwordHash = await bcrypt.hash(data.password, 10)

        const payload = (Date.now() + Math.random()).toString()
        const token = await bcrypt.hash(payload, 10)

        const newUser = new User({
            name: data.name,
            email: data.email,
            password: passwordHash,
            token: token,
            state: data.state
        })
        await newUser.save()

        res.json({data: token})
    },

}

module.exports = AuthController