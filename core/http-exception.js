class httpException extends Error {
  constructor(message="服务器异常",code=400,errorCode=10001){
    super()
    this.message = message
    this.code = code
    this.errorCode = errorCode
  }
}
class ParameterException extends httpException{
  constructor(message,errorCode){
    super();
    this.message = message || '参数错误';
    this.errorCode = errorCode || 10000;
    this.code = 400
  }
}

class Success extends httpException{
  constructor(message,errorCode){
    super()
    this.message = message || 'ok'
    this.code = 201
    this.errorCode = errorCode || 0
  }
}

class NotFound extends httpException{
  constructor(msg,errorCode){
    super()
    this.message = msg || "资源未找到"
    this.errorCode = errorCode || 10000
    this.code = 404
  }
}

class AuthoFailed extends httpException{
  constructor(msg,errorCode){
    super()
    this.message = msg || "授权失败"
    this.errorCode = errorCode || 10004
    this.code = 401
  }
}

class Forbbiden extends httpException{
  constructor(msg,errorCode){
    super();
    this.message = msg || '禁止访问'
    this.code = 403
    this.errorCode = errorCode || 10006
  }
}


class LikeException extends httpException{
  constructor(msg,errorCode){
    super();
    this.message = msg || '重复操作异常'
    this.code = 400
    this.errorCode = errorCode || 60005
  }
}
class DislikeException extends httpException{
  constructor(msg,errorCode){
    super();
    this.message = msg || '重复操作异常'
    this.code = 400
    this.errorCode = errorCode || 60005
  }
}
module.exports = {
  httpException,
  ParameterException,
  Success,
  NotFound,
  AuthoFailed,
  Forbbiden,
  DislikeException,
  LikeException
}