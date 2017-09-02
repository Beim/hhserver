const Koa = require('koa')
const path = require('path')
const fs = require('fs')
if (!fs.existsSync(path.join(__dirname, '../db')))
    fs.mkdirSync(path.join(__dirname, '../db'))
const Router = require('koa-router')
const RoomService = require('../entity/RoomService')
const CONFIG = require('../conf/global_conf')



const app = new Koa()
const forums = new Router()
const rs = new RoomService({rid: CONFIG['room_id']}) // room service

const router_files = fs.readdirSync(path.join(__dirname, '../routes'))
for (let rfile of router_files) {
    let router = require(path.join(__dirname, '../routes', rfile))
    forums.use('/api', router.routes(), router.allowedMethods())
}
app.use(forums.routes())

app.listen(CONFIG['port'])
