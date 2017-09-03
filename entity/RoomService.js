const { Room } = require('bilibili-live')
const logger = require('./logger.js')
const messages = require('./messages.js')

class RoomService {

    /*
        config = {
            rid: 92052 // 直播间id
        }
    */
    constructor() {
        this.rs = null
        this._disconnected()
    }

    init_room(config) {
        this.rs = new Room({url: config.rid})
        this._disconnected()
        this._set_rs_handler()
    }

    is_connected() {
        return this.status === 1
    }

    connect() {
        this.rs.connect()
        this._connected()
    }

    disconnect() {
        this.rs.disconnect()
        this._disconnected()
    }

    
    // 设置rs(room service) 的handler
    _set_rs_handler() {
        let rs = this.rs
        rs.on('danmaku.message', (msg) => {
            this._connected()
            logger.log(msg)
            messages.append(msg)
        })
        rs.on('danmaku.connect', () => {
            this._disconnected()
            logger.log('正在连接')
        })
        rs.on('danmaku.connected', () => {
            this._connected()
            logger.log('已经连接')
        })
        rs.on('danmaku.close', () => {
            this._disconnected()
            logger.log('关闭连接')
        })
        rs.on('danmaku.error', () => {
            this._disconnected()
            logger.log('发生错误')
        })
        
    }

    _connected() {
        this.status = 1
    }

    _disconnected() {
        this.status = 0
    }

}

module.exports = RoomService