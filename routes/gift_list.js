const router = require('koa-router')()
const path = require('path')
const gifts = require(path.join(__dirname, '../entity/gifts.js'))
const giftlist = require(path.join(__dirname, '../entity/giftlist.js'))
const ResMsg = require(path.join(__dirname, '../entity/ResMsg.js'))

router.get('/get/giftlist', async (ctx, next) => {
    ctx.body = giftlist.get()
    await next()
})

router.get('/add/giftlist/:gift_name', async (ctx, next) => {
    let gift_name = ctx.params.gift_name
    giftlist.append(gift_name)
    ctx.body = ResMsg(1, 'success')
    await next()
})

router.get('/del/giftlist/:gift_name', async (ctx, next) => {
    let gift_name = ctx.params.gift_name
    giftlist.del(gift_name)
    ctx.body = ResMsg(1, 'success')
    await next()
})

module.exports = router