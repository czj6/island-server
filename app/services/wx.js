const axios = require('axios')
const util = require('util')
const {AuthoFailed} = require('../../core/http-exception')
const {LoginUrl,AppID,AppSecret} = require('../../config/config').wx;
const {User} = require('../../models/user')
const {generateToken} = require('../../core/util')
const {Auth} = require('../../middleware/auth')
class WXManager{
  static async codeToToken(code){
    const url = util.format(LoginUrl,AppID,AppSecret,code)
    const result = await axios.get(url)
    if(result.status !== 200 ){
      throw new AuthoFailed("获取openId失败")
    }
    let errcode = result.data.errcode
    let errmsg = result.data.errmsg
    if( errcode){
      throw new AuthoFailed("获取openid失败:"+errmsg)
    }

    let user = await User.getUserByOpenid(result.data.openid)
    if(!user){
      user = await User.registerByOpenid(result.data.openid)
    }
    return generateToken(user.id,Auth.USER)
  }
}
module.exports = {
  WXManager
}