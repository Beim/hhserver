const router = require('koa-router')()
const path = require('path')
const gifts = require(path.join(__dirname, '../entity/gifts.js'))
const ResMsg = require(path.join(__dirname, '../entity/ResMsg.js'))

// /api/get/[自动铅笔]/goal
router.get('/get/:gift_name/goal', async (ctx, next) => {
    let gift_name = ctx.params.gift_name
    let goal = gifts.get_gift_goal(gift_name)
    if (goal === false) {
        ctx.body = ResMsg(0, '礼物不存在')
    }
    else {
        ctx.body = ResMsg(1, 'success', goal)
    }
    await next()
})

// /api/set/[自动铅笔]/goal?num=[1000]
router.get('/set/:gift_name/goal', async (ctx, next) => {
    let gift_name = ctx.params.gift_name
    let num = ctx.query.num
    let ret = gifts.set_gift_goal(gift_name, num)
    if (ret) ctx.body = ResMsg(1, 'success')
    else ctx.body = ResMsg(0, '礼物不存在')
    await next()
})

// /api/del/[笔记本]
router.get('/del/:gift_name', async (ctx, next) => {
    let gift_name = ctx.params.gift_name
    gifts.del_gift(gift_name)
    ctx.body = ResMsg(1, 'success')
    await next()
})

module.exports = router