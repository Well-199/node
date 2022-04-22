const Category = require('../models/Category')
const State = require('../models/State')
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

                if(['image/jpeg', 'image/jpg', 'image/png'].includes(req.files.img.mimetype)){
                        
                    // url recebe o retorno do nome da imagem gerado
                    let url = await addImage(req.files.img.data)
                    newAd.images.push({
                        url: url,
                        default: false
                    })
                }
            }
            else{
                // mais de uma imagem
                for(let i=0; i < req.files.img.length; i++){

                    if(['image/jpeg', 'image/jpg', 'image/png'].includes(req.files.img[i].mimetype)){
                        
                        // url recebe o retorno do nome da imagem gerado
                        let url = await addImage(req.files.img[i].data)
                        newAd.images.push({
                            url: url,
                            default: false
                        })
                    }
                }

            }

        }

        if(newAd.images.length > 0){
            newAd.images[0].default = true
        }

        const info = await newAd.save()

        res.json({data: info._id})
    },

    async getList (req, res){

        let { sort='asc', offset=0, limit=8, q, cat, state} = req.query

        let filters = { status: true }

        if(q){
            filters.title = { '$regex': q, '$options': 'i' }
        }

        if(cat){
            const c = await Category.findOne({ slug:cat }).exec()

            if(c){
                filters.category = c._id.toString()
            }
        }

        if(state){
            const s = await State.findOne({ name:state.toUpperCase() }).exec()

            if(s){
                filters.state = s._id.toString()
            }
        }

        const adsTotal = await Ad.find(filters).exec()
        total = adsTotal.length

        const adsData = await Ad.find(filters)
            .sort({dateCreated: (sort=='desc'?-1:1)})
            .skip(parseInt(offset))
            .limit(parseInt(limit))
            .exec()

        let ads = []

        for(let i in adsData){
            let image;

            let defaultImg = adsData[i].images.find(e => e.default==true)

            if(defaultImg){
                image = `${process.env.BASE}/images/${defaultImg.url}`
            }
            else{
                image = `${process.env.BASE}/images/default.jpeg`
            }

            ads.push({
                id: adsData[i]._id,
                title: adsData[i].title,
                price: adsData[i].price,
                priceNegotiable: adsData[i].priceNegotiable,
                image: image
            })
        }
        res.json({data: ads, total: total})
    },

    async getItem (req, res){

        res.json("ok")
    },

    async editAction (req, res){

        res.json("ok")
    }

}

module.exports = AdsController