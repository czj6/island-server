const {Sequelize,Model} = require('sequelize')
const {sequelize} = require('../core/db')
const {NotFound} = require('../core/http-exception')
class Flow extends Model{
  static async GetLatest(){
    return await Flow.findOne({
      order:[
        ['index','DESC']
      ]
    })
  }
  static async GetNext(index){
    index++
    let flow = await Flow.findOne({
      where: {
        index
      }
    })
    if(!flow){
      throw new NotFound("这已经是最新一期了！！！")
    }
    return flow
  }
  static async GetPre(index){
    index--
    let flow = await Flow.findOne({
      where: {
        index
      }
    })
    if(!flow){
      throw new NotFound("这已经是最老的一期了！！！")
    }
    return flow
  }
}
Flow.init({
  index: Sequelize.INTEGER,
  art_id: Sequelize.INTEGER,
  type: Sequelize.INTEGER
},{
  sequelize,
  tableName: 'flow'
})

module.exports = {
  Flow
}