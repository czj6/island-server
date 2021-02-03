const {Sequelize,Model,Op, CITEXT} = require('sequelize')
const {LikeException,DislikeException, NotFound} = require('../core/http-exception')
const {sequelize} = require('../core/db')
const {Art} = require('../models/art')
class Favor extends Model{
  static async Like(uid,art_id,type){
    if (type == 400){
      const {Book} = require('./book')
      let art = await Book.findOne({
        where:{
          id: art_id,
        }
      })
      if(!art){
        art = Book.create({
          id: art_id
        })
      }else{
        art.increment('nums',{by:1})
      }
    }
    const favor = await Favor.findOne({
      where:{
        uid,
        art_id,
        type
      }
    })
    if(favor){
      throw new LikeException()
    }
    return sequelize.transaction(async t =>{
      await Favor.create({
        uid,
        art_id,
        type
      },{transaction:t})
      const art = await Art.GetLatestByType(art_id,type)
      await art.increment('fav_nums',{by:1,transaction: t})
    })
  }

  static async Dislike(uid,art_id,type){
    if (type == 400){
      const {Book} = require('./book')
      let art = await Book.findOne({
        where:{
          id: art_id,
        }
      })  
      art.decrement('nums',{by: 1})
    }
    const favor = await Favor.findOne({
      where:{
        uid,
        art_id,
        type
      }
    })
    if(!favor){
      throw new DislikeException("亲，您已操作过了")
    }
    return sequelize.transaction(async t =>{
      await favor.destroy({
        force: true,
        transaction: t
      }) 
      const art = await Art.GetLatestByType(art_id,type)
      await art.decrement('fav_nums',{by:1,transaction: t})
    })
  }
  // 查询用户是否点过赞
  static async userLikeIt(art_id,type,uid){
    let favor =await Favor.findOne({
      where:{
        uid,
        type,
        art_id
      }
    })
    return !!favor
  }

  // 查询用户点赞的期刊列表
  static async GetAllLikeList(uid){
    const favorList = await Favor.findAll({
      where:{
       type:{
          [Op.not]: 400
       },
        uid
      }
    })
    if(!favorList){
      throw new NotFound()
    }
    return favorList
  }
}

Favor.init({
  uid: Sequelize.INTEGER,
  art_id: Sequelize.INTEGER,
  type: Sequelize.INTEGER
},{
  sequelize,
  tableName: 'favor'
})

module.exports = {
  Favor
}