const router = require('koa-router')()
const path = require('path')
const gifts = require(path.join(__dirname, '../entity/gifts.js'))

// /get
router.get('/get', async (ctx, next) => {
    ctx.body = gifts.get_all()
    await next()
})

module.exports = router