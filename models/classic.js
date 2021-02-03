const {Sequelize,Model} = require('sequelize')
const {sequelize} = require('../core/db')

const classicField = {
  image: Sequelize.STRING,
  content: Sequelize.STRING,
  pubdate: Sequelize.DATEONLY,
  title: Sequelize.STRING,
  fav_nums: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  type:Sequelize.TINYINT
}



class Movie extends Model{

}
Movie.init(classicField,{
  sequelize,
  tableName: 'movie'
})



class Music extends Model{

}
Music.init(Object.assign({
  url: Sequelize.STRING
},classicField),{
  sequelize,
  tableName: 'music'
})




class Sentence extends Model{

}
Sentence.init(classicField,{
  sequelize,
  tableName: 'sentence'
})




module.exports = {
  Movie,
  Music,
  Sentence
}