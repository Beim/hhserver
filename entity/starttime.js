const fs = require('fs')
const path = require('path')

const CONFIG = require(path.join(__dirname, '../conf/global_conf.js'))
const START_TIME_DB = path.join(__dirname, '../db', CONFIG['START_TIME_DB'])

class StartTime {

    constructor() {
        // 礼物数据文件存在
        if (fs.existsSync(START_TIME_DB)) {
            this.start_time = parseInt(require(START_TIME_DB))
        }
        else {
            this.start_time = 0
            // 创建文件
            this._sync()
        }
    }

    start() {
        this.start_time = new Date().getTime()
        this._sync()
    }

    stop() {
        this.start_time = 0
        this._sync()
    }

    // 从开始时间到现在的间隔时间，若开始时间为0 则返回0
    duration() {
        if (this.start_time === 0) return 0
        let now_time = new Date().getTime()
        return now_time - this.start_time
    }

    _sync() {
        fs.writeFileSync(START_TIME_DB, this.start_time)
    }
}

module.exports = new StartTime()