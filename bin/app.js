const Koa = require('koa')
const koa_static = require('koa-static')
const path = require('path')
const fs = require('fs')
if (!fs.existsSync(path.join(__dirname, '../db')))
    fs.mkdirSync(path.join(__dirname, '../db'))
const Router = require('koa-router')
const RoomService = require('../entity/RoomService')
const UpdateGiftService = require('../entity/UpdateGiftService')
const CONFIG = require('../conf/global_conf')

const app = new Koa()
const forums = new Router()
const rs = new RoomService() // room service
const ugs = new UpdateGiftService()

let recent_visit_time = new Date().getTime()
setInterval(() => {
    if (rs.is_connected() && new Date().getTime() - recent_visit_time > CONFIG['idle_time']) {
        rs.disconnect()
    }
}, 1000 * 60 * 10)

app.use(async (ctx, next) => {
    ctx.room_service = rs
    ctx.update_gift_service = ugs
    recent_visit_time = new Date().getTime()
    await next()
})

const router_files = fs.readdirSync(path.join(__dirname, '../routes'))
for (let rfile of router_files) {
    let router = require(path.join(__dirname, '../routes', rfile))
    forums.use('/api', router.routes(), router.allowedMethods())
}
app.use(forums.routes())

app.use(koa_static(path.join(__dirname, '../public')))

app.listen(CONFIG['port'])
