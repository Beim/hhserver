const fs = require('fs')
const path = require('path')

const CONFIG = require(path.join(__dirname, '../conf/global_conf.js'))
const MSG_LIST_DB = path.join(__dirname, '../db', CONFIG['MSG_LIST_DB'])

class GiftList {

    constructor() {
        // 礼物数据文件存在
        if (fs.existsSync(MSG_LIST_DB)) {
            this.gift_list = require(MSG_LIST_DB)
        }
        else {
            this.gift_list = [].concat(CONFIG['def_gift_list'])
            // 创建文件
            this._sync()
        }
    }

    get() {
        return this.gift_list
    }

    append(gift) {
        if (!this.gift_list.includes(gift)) {
            this.gift_list.push(gift)
            this._sync()
        }
    }

    del(gift) {
        let idx = this.gift_list.indexOf(gift)
        if (idx > 0) {
            this.gift_list.splice(idx, 1)
            this._sync()
        }
    }

    _sync() {
        fs.writeFileSync(MSG_LIST_DB, JSON.stringify(this.gift_list, null, 4))
    }
}

module.exports = new GiftList()