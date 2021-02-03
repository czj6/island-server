const {Sequelize,Model} = require('sequelize')
const {sequelize} = require('../core/db')
const { Book } = require('./book')

class BookComment extends Model{
  static async addComment(bookId,content){
    const comment = await BookComment.findOne({
      where:{
        id: bookId,
        content
      }
    })
    if(comment){
      return await comment.increment('nums',{by:1})
    }else{
      return await BookComment.create({
        id: bookId,
        content,
        nums: 1
      })
    }
  }

  static async getShortComment(bookId){
    const comments = await BookComment.findOne({
      where:{
        id: bookId
      }
    })
    return comments
  }
  toJSON(){
    return {
      content: this.getDataValue('content'),
      nums: this.getDataValue('nums')
    }
  }
}

BookComment.init({
  id:{
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  content:{
    type: Sequelize.STRING(16)
  },
  nums:{
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
},{
  sequelize,
  tableName: 'comment'
})


module.exports = {
  BookComment
}