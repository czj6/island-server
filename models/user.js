const bcrypt = require('bcryptjs')
const {sequelize} = require('../core/db')
const {NotFound,AuthoFailed} = require('../core/http-exception')
const {Sequelize,Model} = require('sequelize')


class User extends Model{
  static async vetifyEmailPassword(email,password){
    const user = await User.findOne({
      where:{
        email
      }
    })
    if(!email){
      throw new NotFound("账号未找到")
    }
    const correct = bcrypt.compareSync(password,user.password)
    if(!correct){
      throw new AuthoFailed("密码不正确")
    }
    return user
  }

  static async getUserByOpenid(openid){
    const user = await User.findOne({
      where:{
        openid
      }
    })
    return user
  }
  static async registerByOpenid(openid){
    return await User.create({
      openid
    })
  }
}
User.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nickname: Sequelize.STRING,
  email:{
    type: Sequelize.STRING(128),
    unique: true
  },
  password:{ 
    type: Sequelize.STRING,
    set(val){
      const salt = bcrypt.genSaltSync(10)
      const psw = bcrypt.hashSync(val,salt)
      this.setDataValue("password",psw)
    }
  },
  openid: {
    type: Sequelize.STRING(64),
    unique: true
  }
},{
  sequelize,
  tableName: 'user'
})

module.exports = {User}