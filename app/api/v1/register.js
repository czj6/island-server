const Router = require('koa-router')
const {RegisterValidator} = require('../../validator/validator')
const {User} = require('../../../models/user')
const {Success} = require('../../../core/http-exception')
const router = new Router({
  prefix: '/v1/user'
});

router.post('/register', async(ctx)=>{
  const v = await new RegisterValidator().validate(ctx)
 
  let user = {
    email: v.get('body.email'),
    password: v.get('body.password2'),
    nickname: v.get('body.nickName'),
  }
  const r = await User.create(user)
  throw new Success()
})
module.exports = router