const { validationResult, matchedData } = require('express-validator')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const State = require('../models/State')
const User = require('../models/User')
const Category = require('../models/Category')
const Ad = require('../models/Ad')

const UserController = {

    async getStates (req, res){
        let states = await State.find()

        res.json({states: states})
    },

    async info (req, res){

        let token = req.query.token

        const user = await User.findOne({token: token})

        if(!user){
            res.json({data: 'usuario não encontrado/ token invalido'})
            return
        }

        const state = await State.findById(user.state)

        if(!state){
            res.json({data: 'Estado não cadastrado'})
            return
        }

        const ads = await Ad.find({idUser: user._id.toString()})

        let adList = []

        for(let i in ads){

            const cat = await Category.findById(ads[i].category)

            adList.push({
                id: ads[i].id,
                status: ads[i].status,
                images: ads[i].images,
                dateCreated: ads[i].dateCreated,
                title: ads[i].title,
                price: ads[i].price,
                priceNegotiable: ads[i].priceNegotiable,
                description: ads[i].description,
                views: ads[i].views,
                category: cat.slug
            })
        }

        let data = {
            name: user.name,
            email: user.email,
            state: state.name,
            ads: adList
        }

        res.json({data: data})
    },

    async editAction (req, res){

        const errors = validationResult(req)
        if(!errors.isEmpty()){
            res.json({error: errors.mapped()})
            return
        }
        const data = matchedData(req)

        let updates = {}

        if(data.name){
            updates.name = data.name
        }

        if(data.email){

            const checkEmail = await User.findOne({email: data.email})

            if(checkEmail){
                res.json({error: 'E-mail ja cadastrado'})
                return
            }

            updates.email = data.email
        }

        if(data.state){

            if(mongoose.Types.ObjectId.isValid(data.state)){
                const checkState = await State.findById(data.state)

                if(!checkState){
                    res.json({error: 'Estado não existe'})
                    return
                }
                updates.state = data.state
            }
            else{
                res.json({error: "Id do estado invalido"})
                return
            }
            
        }

        if(data.password){
            updates.passwordHash = await bcrypt.hash(data.password, 10)
        }

        await User.findOneAndUpdate({token: data.token}, {$set: updates})

        res.json({data: updates})
    }

}

module.exports = UserController
