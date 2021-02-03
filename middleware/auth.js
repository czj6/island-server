const basicAuth = require('basic-auth')
const {Forbbiden} = require('../core/http-exception')
const jwt = require('jsonwebtoken')
const {secretKey} = require('../config/config').sesecurity
class Auth{
  constructor(lever){
      Auth.USER = 8
      Auth.ADMIN = 16
      this.lever =lever || 1
  }

  get m(){
    return async(ctx,next)=>{
      // basic auth 的格式    Authorization: 'basic '+base64(account:password)
      const userToken = basicAuth(ctx.req)
      if(!userToken || !userToken.name){
        throw new Forbbiden("禁止访问")
      }
      try{
        var decode =  jwt.verify(userToken.name,secretKey)
      }catch(err){
        if(err.name == 'TokenExpiredError'){
          throw new Forbbiden('token已过期了')
        }
        throw new Forbbiden("禁止访问")
      }
      if(decode.scope < this.lever){
        throw new Forbbiden('权限不足')
      }
      ctx.auth = {
        uid: decode.uid,
        scope: decode.scope
      }
      // ctx.body = userToken
      await next()
    }
  }

  static verifyToken(token){
    try{
      var decode =  jwt.verify(token,secretKey)
      return true
    }catch(err){
      return false
    }
  }
}
module.exports = {Auth}