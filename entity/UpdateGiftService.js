const http = require('http')
const fs = require('fs')
const cheerio = require('cheerio')
const path = require('path')

const CONFIG = require(path.join(__dirname, '../conf/global_conf.js'))
const MSG_LIST_DB = path.join(__dirname, '../db', CONFIG['MSG_LIST_DB'])
const GIFT_ICON_DB = path.join(__dirname, '../db', CONFIG['GIFT_ICON_DB'])


const get = (url) => {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            if (res.statusCode !== 200) {
                return resolve(null)
            }
            else {
                res.setEncoding('utf8')
                let rawData = ''
                res.on('data', (c) => {
                    rawData += c
                })
                res.on('end', () => {
                    return resolve(rawData)
                })
            }
        })
    })
}

const update = async () => {
    try {
        const html = await get('http://live.bilibili.com/221')
        const $ = cheerio.load(html)
        let gift_items = $('.gift-item')
        let gifts = []
        let gift_icon = {}
        for (let i = 0; i < gift_items.length; i++) {
            let gift = $(gift_items[i]).attr('data-title')
            if (gift) {
                gifts.push(gift)
                gift_icon[gift] = parseInt($(gift_items[i]).attr('data-gift-id'))
            }
        }
        if (gifts.length > 1) {
            fs.writeFileSync(MSG_LIST_DB, JSON.stringify(gifts, null, 4))
            fs.writeFileSync(GIFT_ICON_DB, JSON.stringify(gift_icon, null, 4))
        }
        
    }
    catch (e) {
        console.log(e)
    }
    
}

class UpdateGiftService {

    constructor() {
        update()
        setInterval(update, 10 * 60 * 1000)
    }

    get_icon_id() {
        return JSON.parse(fs.readFileSync(GIFT_ICON_DB))
    }
}

module.exports = UpdateGiftService
new UpdateGiftService()