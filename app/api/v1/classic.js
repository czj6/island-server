const Router = require('koa-router')
const {IntegetValidator,LikeValidator} = require('../../validator/validator')
const {Auth} = require('../../../middleware/auth')
const {Flow} = require('../../../models/flow')
const {Art} = require('../../../models/art')
const {Favor} = require('../../../models/favor')
const {NotFound} = require('../../../core/http-exception')
const router = new Router({
  prefix: '/v1/classic'
});
// 获取最新一期的期刊
router.get('/latest',new Auth().m,async(ctx,next) => {
  const flow =await Flow.findOne({
    order:[
      ['index','DESC']
    ]
  })
  let favor = await Favor.userLikeIt(flow.art_id,flow.type,ctx.auth.uid)
  let art = await Art.GetLatestByType(flow.art_id,flow.type)
  art.setDataValue("index",flow.index)
  art.setDataValue("like_status",favor)
  ctx.body = art
})

// 获取下一期的期刊
router.get('/:index/next',new Auth().m, async(ctx,next)=>{
  const v = await new IntegetValidator().validate(ctx,{
    id: 'index'
  })
  let flow = await Flow.GetNext(v.get('path.index'))
  ctx.body = await getNextOrPre(flow,v,ctx)
})

// 获取上一期的周刊
router.get('/:index/pre',new Auth().m,async(ctx,next)=>{
  const v = await new IntegetValidator().validate(ctx,{
    id: 'index'
  })
  let flow = await Flow.GetPre(v.get('path.index'))
  ctx.body = await getNextOrPre(flow,v,ctx)
})

async function getNextOrPre(flow,v,ctx){
  let favor = await Favor.userLikeIt(flow.art_id,flow.type,ctx.auth.uid)
  let art = await Art.GetLatestByType(flow.art_id,flow.type)
  art.setDataValue("index",flow.index)
  art.setDataValue("like_status",favor)
  return art
}

// 获取点赞信息
router.get('/:type/:id/favor',new Auth().m, async(ctx,next)=>{
  const v = await new LikeValidator().validate(ctx)
  let id = parseInt(v.get('path.id'))
  let type = parseInt(v.get('path.type'))
  let art = await Art.GetLatestByType(id,type)
  if(!art){
    throw new NotFound("资源未找到")
  }
  
  let like = await Favor.userLikeIt(id,type,ctx.auth.uid)
  ctx.body = {
    "fav_nums": art.fav_nums,
    "like_status": like
  }

})

// 获取用户所有点赞的期刊列表
router.get('/favor',new Auth().m, async(ctx)=>{
   const list = await Art.GetAllLikeArt(ctx.auth.uid)
   ctx.body = list
})


// 获取某一期期刊详情列表
router.get('/:type/:id',new Auth().m,async(ctx)=>{
  const v = await new LikeValidator().validate(ctx)
  let id = parseInt(v.get('path.id'))
  let type = parseInt(v.get('path.type'))
  let art = await new Art(id,type).getDetail(ctx.auth.uid)
  ctx.body = art
})
module.exports = router