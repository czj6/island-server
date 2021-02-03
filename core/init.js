const Router = require("koa-router")
const requireDirectory = require("require-directory")
class initManager{
  static init(app){
    initManager.app = app;
    initManager.initRouter()  
    initManager.loadConfig()
  }
  static initRouter() {
    const modules = requireDirectory(module,'../app/api',{visit: registerRouters})
    // 在koa里面一切都是中间件
    // 将modules里的路由注册
    function registerRouters(item){
        if(item instanceof Router){
          initManager.app.use(item.routes())
        }
    } 
  }

  static loadConfig(path=''){
    const configPath = path|| process.cwd()+'/config/config.js'
    const config = require(configPath)
    global.config = config
  }

}
module.exports = initManager;