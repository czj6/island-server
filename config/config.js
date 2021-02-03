module.exports = {
  //prod
  environment: 'dev',
  database:{
    dbName: 'island',
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root'
  },
  sesecurity:{
    secretKey: "wesfsds",
    expiresIn: 60*60
  },
  wx:{
    AppID: 'wxc0b6cd3f1fe33508',
    AppSecret: '6b7569c3abe30f8af06c5bfe94df6161',
    LoginUrl: 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code'
  },
  yushu: {
    detailUrl: 'http://t.talelin.com/v2/book/id/%s',
    keywordUrl: 'http://t.talelin.com/v2/book/search?q=%s&count=%s&start=%s&summary=%s'
  }
}