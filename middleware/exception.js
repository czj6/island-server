const {httpException} = require('../core/http-exception')
const catchError = async(ctx,next)=>{
  try{
    await next()
  }catch(error){
    let isHttpException = error instanceof httpException
    let isDev = global.config.environment === 'dev'
    if(isDev && !isHttpException){
      throw error
    }
    if(isHttpException){
      ctx.body = {
        error_code: error.errorCode,
        message: error.message,
        request_url: `${ctx.method} ${ctx.path}`
      }
      ctx.status= error.code
    }
  }
}
module.exports = catchError