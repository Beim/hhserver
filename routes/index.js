const router = require('koa-router')()
const path = require('path')
const gifts = require(path.join(__dirname, '../entity/gifts.js'))
const ResMsg = require(path.join(__dirname, '../entity/ResMsg.js'))
const starttime = require(path.join(__dirname, '../entity/starttime.js'))

// /get
router.get('/get', async (ctx, next) => {
    ctx.body = gifts.get_all()
    await next()
})

router.get('/stop', async (ctx, next) => {
    if (ctx.room_service.is_connected()) {
        ctx.room_service.disconnect()
        starttime.stop()
    }
    ctx.body = ResMsg(1, 'success')
    await next()
})

router.get('/start/:room_id', async (ctx, next) => {
    if (!ctx.room_service.is_connected()) {
        ctx.room_service.init_room({rid: ctx.params.room_id})
        ctx.room_service.connect()
        starttime.start()
    }
    ctx.body = ResMsg(1, 'success')
    await next()
})

// 获取开始时间到现在的间隔
router.get('/duration', async (ctx, next) => {
    ctx.body = ResMsg(1, 'success', starttime.duration())
    await next()
})

// 获取room_service 的运行状态
router.get('/get/state', async (ctx, next) => {
    ctx.body = ResMsg(1, 'success', ctx.room_service.is_connected())
    await next()
})


module.exports = router