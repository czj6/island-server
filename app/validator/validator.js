const {LinValidator,Rule} = require('../../core/lin-validator');
const {User} = require('../../models/user');
const {LoginType,ArtType} = require('../../app/lib/enum')
class IntegetValidator extends LinValidator{
  constructor(){
    super();
    this.id = [
      new Rule('isInt',"需要整形",{min: 1})
    ]
  }
}
class RegisterValidator extends LinValidator{
  constructor(){
    super();
    this.email = [
      new Rule('isEmail','不符合email规范')
    ]
    this.nickName = [
      new Rule('isLength',"昵称要在4位-32位之间",{max: 32,min: 4})
    ]
    this.password1 = [
      new Rule('isLength',"密码要在6位-20位之间",{max: 20,min: 6}),
      new Rule('matches',"密码强度不够，要包含特殊字符",
        '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]')
    ]
    this.password2 = this.password1 
  }

  validatePassword(vals){
    const pw1 = vals.body.password1
    const pw2 = vals.body.password2
    if(pw1 !== pw2){
      throw new Error("两次密码必须一致")
    }
  }
  async validateEmail(vals){
    const email = vals.body.email;
    const user =await User.findOne({
      where: {
        email
      }
    })
    if(user){
      throw new Error("邮箱已经注册")
    }
  }
}

class TokenValidator extends LinValidator{
  constructor(){
    super();
    this.account = [
      new Rule('isLength','不符合账号规则',{
        max: 32,
        min: 4
      })
    ];
    this.secret = [
      new Rule('isOptional'),
      new Rule('isLength','至少6个字符',{
        min: 6
      })
    ]
  }
  validateType(val){
    if(!val.body.type){
      throw new Error("type是必填参数")
    }
    if(!LoginType.isThisType(val.body.type)){
      throw new Error('type参数不合法')
    }
  }
}

function judgeArtType(val){
  let type = val.body.type || val.path.type;
  if(!type){
    throw new Error("type是必填参数")
  }
  if(!ArtType.isThisType(parseInt(type))){
    throw new Error('type参数不合法')
  }
}

class NotEmptyValidator extends LinValidator{
  constructor(){
    super()
    this.token = [
      new Rule('isLength',"不能为空",{min:1})
    ]
  }
}

class LikeValidator extends IntegetValidator{
  constructor(){
    super()
    this.validateLikeType = judgeArtType
  }
}

class SearchValidator extends LinValidator{
  constructor(){
    super()
    this.q = [
      new Rule('isLength',"搜索长度不符合规则",{min:0,max:16})
    ]
    this.start = [
      new Rule('isInt','不符合规范',{
        min: 0,
        max: 60000
      }),
      new Rule('isOptional','',0)
    ]
    this.count = [
      new Rule('isInt','不符合规范',{
        min: 1,
        max: 20
      }),
      new Rule('isOptional','',20)
    ]
  }
}

class BookCommentValidator extends IntegetValidator{
  constructor(){
    super()
    this.content = [
      new Rule('isLength','字符要在1至16之间',{min:1,max:16})
    ]
  }
}


module.exports = {SearchValidator,IntegetValidator,RegisterValidator,TokenValidator,NotEmptyValidator,LikeValidator,BookCommentValidator}