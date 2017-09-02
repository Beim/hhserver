const { Room } = require('bilibili-live')
const logger = require('./logger.js')
const messages = require('./messages.js')

class RoomService {

    /*
        config = {
            rid: 92052 // 直播间id
        }
    */
    constructor(config) {
        this.rs = new Room({url: config.rid})
        this.rs.connect()
        this._set_rs_handler()
    }

    // 设置rs(room service) 的handler
    _set_rs_handler() {
        let rs = this.rs
        rs.on('danmaku.message', (msg) => {
            logger.log(msg)
            messages.append(msg)
        })
        rs.on('danmaku.connect', () => {
            logger.log('正在连接')
        })
        rs.on('danmaku.connected', () => {
            logger.log('已经连接')
        })
        rs.on('danmaku.close', () => {
            logger.log('关闭连接')
        })
        rs.on('danmaku.error', () => {
            logger.log('发生错误')
        })
        
    }

}

module.exports = RoomService