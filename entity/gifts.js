const fs = require('fs')
const path = require('path')
const CONFIG = require(path.join(__dirname, '../conf/global_conf.js'))

const GIFT_DB = path.join(__dirname, '../db', CONFIG['GIFT_DB'])

/*
{
    '辣条': [0, 1000],
    '自动铅笔': [0, 200]
}
*/
class Gifts {

    constructor() {
        // 礼物数据文件存在
        if (fs.existsSync(GIFT_DB)) {
            this.gift_db = require(GIFT_DB)
        }
        else {
            this.gift_db = {}
            // 创建文件
            this._sync()
        }
    }

    // 添加礼物
    append(gift) {
        if (!this.gift_db[gift.name]) return false
        this._add_gift(gift.name, gift.count)
        this._sync()
        return true
    }

    // 返回所有数据
    get_all() {
        return this.gift_db
    }

    // 将所有礼物数量重置为0
    clear_gift() {
        for (let gift_name in this.gift_db) {
            this.gift_db[gift_name][0] = 0
        }
        this._sync()
    }

    // 获取礼物数量，不存在返回false
    get_gift_count(gift_name) {
        if (!this.gift_db[gift_name]) return false
        return this.gift_db[gift_name][0]
    }

    // 获取目标数量，礼物不存在返回false
    get_gift_goal(gift_name) {
        if (!this.gift_db[gift_name]) return false
        return this.gift_db[gift_name][1]
    }

    // 设置礼物数量，不存在或数量为负数返回false
    set_gift_count(gift_name, num) {
        if (!this.gift_db[gift_name] || parseInt(num) < 0) return false
        this.gift_db[gift_name][0] = parseInt(num)
        this._sync()
        return true
    }

    // 设置目标，不存在则新建，存在则设置；目标数为负数返回false
    set_gift_goal(gift_name, goal_num) {
        if (parseInt(goal_num) < 0) return false
        if (!this.gift_db[gift_name]) {
            this.gift_db[gift_name] = [0, parseInt(goal_num)]
        }
        else {
            this.gift_db[gift_name][1] = parseInt(goal_num)
        }
        this._sync()
        return true
    }

    // 删除礼物
    del_gift(gift_name) {
        delete this.gift_db[gift_name]
        this._sync()
        return true
    }

    // 增加某个礼物的数量
    _add_gift(gift_name, num) {
        this.gift_db[gift_name][0] += parseInt(num)
    }

    _sync() {
        fs.writeFileSync(GIFT_DB, JSON.stringify(this.gift_db, null, 4))
    }
}

module.exports = new Gifts()