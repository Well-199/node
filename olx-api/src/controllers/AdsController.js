const Category = require('../models/Category')
const User = require('../models/User')
const Ad = require('../models/Ad')

const { v4: uuid } = require('uuid')
const jimp = require('jimp')

// Manipula a imagem
const addImage = async (buffer) => {

    // gera um nome aleatorio para a imagem
    let newName = `${uuid()}.jpg`

    // A Lib jimp faz a leitura do buffer
    let tmpImg = await jimp.read(buffer)

    // Redimensiona a imagem e altera a qualidade sem distorcer a imagem
    // E escreve ou armazena a imagem na pasta images com novo nome
    tmpImg.cover(500, 500).quality(80).write(`./public/images/${newName}`)

    // retorna o nome ou caminho da imagem para ser armazenado no banco
    return newName
}

const AdsController = {

    async getCategories (req, res){

        const cats = await Category.find()

        let categories = []

        for(let i in cats){
            categories.push({
                id: cats[i]._id,
                name: cats[i].name,
                slug: cats[i].slug,
                img: `${process.env.BASE}/assets/${cats[i].slug}.png`
            })
        }

        res.json({data: categories})
    },

    async addAction (req, res){

        let title = req.body.title
        let price = req.body.price
        let priceneg = (req.body.priceneg=='true' ? true : false)
        let desc = req.body.desc
        let cat = req.body.cat
        let token = req.body.token

        if(!title || !cat){
            res.json({data: 'Titulo e Categoria Obrigatórios'})
            return
        }

        if(price){
            price = price.replace('.', '').replace(',','.').replace('R$ ')
            price = parseFloat(price)
        }
        else{
            price = 0
        }

        const user = await User.findOne({token: token}).exec()

        const newAd = new Ad()
        newAd.status = true
        newAd.idUser = user._id
        newAd.state = user.state
        newAd.dateCreated = new Date()
        newAd.title = title
        newAd.category = cat
        newAd.price = price
        newAd.priceNegotiable = priceneg
        newAd.description = desc
        newAd.views = 0

        // Verifica se veio imagens
        if(req.files && req.files.img){

            // Verifica se veio uma ou mais de uma imagem
            if(req.files.img.length == undefined){

            }
            else{

            }

        }

        const info = await newAd.save()

        res.json({data: info._id})
    },

    async getList (req, res){

        res.json("ok")
    },

    async getItem (req, res){

        res.json("ok")
    },

    async editAction (req, res){

        res.json("ok")
    }

}

module.exports = AdsController