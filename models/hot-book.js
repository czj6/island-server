const {Sequelize,Model,Op} = require('sequelize')
const {sequelize} = require('../core/db')
const {Favor} = require('./favor')
class hotBook extends Model{
  static async getAll(){
    const books = await hotBook.findAll({
      order: [
        'index'
      ]
    })
    let ids = []
    books.forEach( item => {
      ids.push(item.id)
    });

    let booksFavor = await Favor.findAll({
      where:{
        art_id:{
          [Op.in]: ids,
          type: 400
        }
      },
      group: ['art_id'],
      attributes: ['art_id',[Sequelize.fn('COUNT','*'),'count']]
    })
    books.forEach( item => {
      hotBook._getEachBook(item,booksFavor)
    })
    return books
  }
  static _getEachBook(book,bookFavor){
    let count = 0
    bookFavor.forEach( item =>{
      if( item.art_id == book.id){
        count = item.get('count')
      }
      item.setDataValues('count',count)
    })
    return book
  }
}
hotBook.init({
  index: Sequelize.INTEGER,
  image: Sequelize.STRING,
  author: Sequelize.STRING,
  title: Sequelize.STRING
},{
  sequelize,
  tableName: 'hot_book'
})

module.exports = {
  hotBook
}