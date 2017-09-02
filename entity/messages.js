const fs = require('fs')
const path = require('path')

const CONFIG = require(path.join(__dirname, '../conf/global_conf.js'))
const MSG_DB = path.join(__dirname, '../db', CONFIG['MSG_DB'])
const gifts = require('./gifts.js')

const skip_msg_type = ['SYS_MSG']

/*
{ type: 'gift', gift: { id: 84, type: 3, name: '自动铅笔', count: 1, price: 2000 }, user: { id: 11588380, name: 'beiming945' }, ts: 1504280064367 }
{ type: 'gift', gift: { id: 84, type: 3, name: '自动铅笔', count: 2, price: 2000 }, user: { id: 11588380, name: 'beiming945' }, ts: 1504280064368 }
{ type: 'gift', gift: { id: 84, type: 3, name: '自动铅笔', count: 3, price: 2000 }, user: { id: 11588380, name: 'beiming945' }, ts: 1504280064369 }
*/
class Messages {

    constructor() {
        // json数据不存在，创建该文件
        if (!fs.existsSync(MSG_DB)) {
            fs.appendFileSync(MSG_DB, '')
        }
    }

    append(msg) {
        if (!skip_msg_type.includes(msg.type))
            this._append_db(msg)
        if (msg['type'] && msg['type'] === 'gift') {
            // TODO 添加礼物
            gifts.append(msg.gift)
        }
    }

    _append_db(obj) {
        // let date = new Date()
        // let prefix = `【${date.toLocaleDateString()}    ${date.toLocaleTimeString()}】`
        // let new_item = `${prefix}   ${JSON.stringify(obj)}`
        fs.appendFileSync(MSG_DB, JSON.stringify(obj) + '\n')
    }

}

module.exports = new Messages()