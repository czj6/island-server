const Router = require('koa-router')
const {TokenValidator,NotEmptyValidator} = require('../../validator/validator')
const {ParameterException} = require('../../../core/http-exception')
const {LoginType} = require('../../lib/enum')
const {User} = require('../../../models/user')
const {generateToken} = require('../../../core/util')
const {Auth} = require('../../../middleware/auth')
const {WXManager} = require('../../services/wx')
const router = new Router({
  prefix: '/v1/token'
})

router.post('/', async(ctx)=>{
  const v = await new TokenValidator().validate(ctx);
  let token
  switch(v.get('body.type')){
    case LoginType.USER_EMAIL:
      token =  await emailLogin(v.get('body.account'),v.get('body.secret'))
      break
    case LoginType.USER_MINI_PROGRAM:
      token = await WXManager.codeToToken(v.get('body.account'))
      break
    default:
      throw new ParameterException("参数错误")
  }
  ctx.body = {
    token
  }
  
})

router.post('/vertify',async(ctx)=>{
  const v = await new NotEmptyValidator().validate(ctx);
  let result = Auth.verifyToken(v.get('body.token'))
  ctx.body = {
    "is_valid": result
  }
})
async function emailLogin(email,password){
  const user = await User.vetifyEmailPassword(email,password)
  return token = generateToken(user.id, Auth.USER)
}

module.exports = router