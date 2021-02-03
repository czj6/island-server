const Router = require('koa-router')
const {LikeValidator} = require('../../validator/validator')
const {Auth} = require('../../../middleware/auth')
const {Favor} = require('../../../models/favor')
const {Success} = require('../../../core/http-exception')

const router = new Router({
  prefix: '/v1/like'
})

router.post('/',new Auth().m,async (ctx,next)=>{
  const v = await new LikeValidator().validate(ctx,{
    id: 'art_id'
  })
  await Favor.Like(ctx.auth.uid,v.get('body.art_id'),v.get('body.type'))
  throw new Success()
})



router.post('/cancel',new Auth().m,async (ctx,next)=>{
  const v = await new LikeValidator().validate(ctx,{
    id: 'art_id'
  })
  await Favor.Dislike(ctx.auth.uid,v.get('body.art_id'),v.get('body.type'))
  throw new Success()
})
module.exports = router