const Router = require('koa-router')
const {IntegetValidator,SearchValidator,BookCommentValidator} = require('../../validator/validator')
const {Auth} = require('../../../middleware/auth')
const {Flow} = require('../../../models/flow')
const {hotBook} = require('../../../models/hot-book')
const {Book} = require('../../../models/book')
const {BookComment} = require('../../../models/book-comment')
const {Success} = require('../../../core/http-exception')
const router = new Router({
  prefix: '/v1/book'
});
router.get('/latest',new Auth().m,async(ctx,next) => {
  const flow =await Flow.GetLatest()
  ctx.body = {
    flow
  }
})
router.get( '/hot_list' , new Auth().m , async(ctx,next) => {
  const books = await hotBook.getAll()
  ctx.body = {
    books
  }
})
router.get( '/:id/detail' , new Auth().m , async(ctx,next)=>{
  const v = await new IntegetValidator().validate(ctx);
  const book = new Book()
  ctx.body = await book.detail(v.get('path.id'))
})

router.get('/search', new Auth().m , async(ctx,next) => {
  const v = await new SearchValidator().validate(ctx)
  const book = new Book()
  let books = await book.search(v.get('query.q'),v.get('query.start'),v.get('query.count'))
  ctx.body = {
    books
  }
})


router.get('/book/favor/count',new Auth().m , async(ctx,next) => {
  const count = await Book.getFavorBooks(ctx.auth.uid)
  ctx.body = {
    count
  }
})


router.get('/:book_id/favor' , new Auth().m , async(ctx,next) => {
  const v = await new IntegetValidator().validate(ctx,{
    id: 'book_id'
  })
  const result = await Book.getOneBookFavor(v.get('path.book_id'),ctx.auth.uid)
  ctx.body = result
})


router.post('/add/short_comment' , new Auth().m , async(ctx,next) => {
  const v = await new BookCommentValidator().validate(ctx,{
    id: 'book_id'
  })

  BookComment.addComment(v.get('body.book_id'),v.get('body.content'))
  throw new Success("评论成功")
})

router.get('/:book_id/short_comment', new Auth().m, async(ctx,next) => {
  const v = await new IntegetValidator().validate(ctx,{
    id: 'book_id'
  })
  console.log(111);
  const comment = await BookComment.getShortComment(v.get('path.book_id'))
  ctx.body = {
    comment,
    "book_id": v.get('path.book_id')
  }
})


router.get('/book/hot_keyword', new Auth().m, async (ctx,next) => {
  ctx.body = {
    'hot' : [ 
      'Python' ,
      '哈利·波特',
      '村上春树',
      '东野圭吾',
        '白夜行',
          '韩寒',
            '金庸',
            '王小波'
    ]
  }    
})


module.exports = router