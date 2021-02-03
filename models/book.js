const {Sequelize,Model} = require('sequelize')
const util = require('util')
const axios = require('axios')
const {sequelize} = require('../core/db')
const { Favor } = require('./favor')

class Book extends Model{
  async detail(id){
    const url = util.format(global.config.yushu.detailUrl,id)
    console.log(url)
    const detail = await axios.get(url)
    
    return detail.data
  }
  async search(q,start,count,summary=1){
    const url = util.format(global.config.yushu.keywordUrl,encodeURI(q),count,start,summary)
    console.log(url);
    const result = await axios.get(url)
    return result.data
  }
  static async getFavorBooks(uid){
    const favors = await Favor.count({
      where:{
        uid,
        type: 400
      }
    })
    return favors
  }

  static async getOneBookFavor(id,uid){
    const favNums = await Favor.count({
      where:{
        art_id: id,
        type: 400
      }
    })
    const status = await Favor.userLikeIt(id,400,uid)
    return {
      fav_nums: favNums,
      like_status: status?1:0
    }
  }
}
Book.init({
  id:{
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  fav_nums:{
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
},{
  sequelize,
  tableName: 'book'
})

module.exports = {
  Book
}