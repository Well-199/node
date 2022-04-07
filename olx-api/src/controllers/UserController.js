const State = require('../models/State')

const UserController = {

    async getStates (req, res){
        let states = await State.find()

        res.json({states: states})
    },

    async info (req, res){

        res.json("ok")
    },

    async editAction (req, res){

        res.json("ok")
    }

}

module.exports = UserController
