const {Music,Movie,Sentence} = require('./classic')
const {Op} = require('sequelize')
const {flatten} = require('lodash')
const { NotFound } = require('../core/http-exception')
class Art{
  constructor(art_id,type){
    this.art_id = art_id
    this.type = type
  }
  // 获取某一期的详细信息
  async getDetail(uid){
    const art = await Art.GetLatestByType(this.art_id,this.type);
    if(!art){
      throw new NotFound()
    }
    const {Favor} = require('./favor')
    const like_status = await Favor.userLikeIt(this.art_id,this.type,uid)
    art.setDataValue('like_status',like_status)
    return art
  }
  // 获取最近的一期
  static async GetLatestByType(art_id,type){
    let art;
    const finder = {
      where:{
        id: art_id
      }
    }
    switch(type){
      case 100:
          art = await Movie.findOne(finder)
        break
      case 200:
          art = await Music.findOne(finder)
        break
      case 300:
          art = await Sentence.findOne(finder)
        break
      case 400:
        break
      default: break
    }

    return art
  }
// 获取所有的喜欢期刊列表
  static async GetAllLikeArt(uid){
    const list = await Favor.GetAllLikeList(uid)
    // 本来一个for循环查找就可以， 但是查询数据库次数不可控
    // 所以改造，换成in 方法，一次性查询
    return this._classType(list)
  }

  static async _classType(list){
    let result = []
    let favor_list = {
      100: [],
      200: [],
      300: [],
    }
    for(let item of list){
      favor_list[item.type].push(item.art_id)
    }
    for(let key in favor_list){
      if(favor_list[key].length==0){
        continue
      }
      result.push(await this._getAllLikeArts(favor_list[key],parseInt(key))) 
    }
    return flatten(result);
  }
  static async _getAllLikeArts(ids,type){
    let arts;
    const finder = {
      where:{
        id: {
          [Op.in]: ids
        }
      }
    }
    switch(type){
      case 100:
          arts = await Movie.findAll(finder)
        break
      case 200:
          arts = await Music.findAll(finder)
        break
      case 300:
          arts = await Sentence.findAll(finder)
        break
     
      default: break
    }

    return arts
  }
}


module.exports = {
  Art
}