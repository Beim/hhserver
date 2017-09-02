const router = require('koa-router')()
const path = require('path')
const gifts = require(path.join(__dirname, '../entity/gifts.js'))
const ResMsg = require(path.join(__dirname, '../entity/ResMsg.js'))

// /api/set/[笔记本]/count?num=[100]
router.get('/set/:gift_name/count', async (ctx, next) => {
    let gift_name = ctx.params.gift_name
    let num = ctx.query.num
    let ret = gifts.set_gift_count(gift_name, num)
    if (ret) ctx.body = ResMsg(1, 'success')
    else ctx.body = ResMsg(0, '礼物不存在')
    await next()
})

// /api/get/[笔记本]/count
router.get('/get/:gift_name/count', async (ctx, next) => {
    let gift_name = ctx.params.gift_name
    let count = gifts.get_gift_count(gift_name)
    if (count === false) {
        ctx.body = ResMsg(0, '礼物不存在')
    }
    else {
        ctx.body = ResMsg(1, 'success', count)
    }
    await next()
})

// /api/clear
router.get('/clear', async (ctx, next) => {
    gifts.clear_gift()
    ctx.body = ResMsg(1, 'success')
    await next()
})

module.exports = router