const Koa = require("koa");
const parser = require('koa-bodyparser')
const initManager = require('./core/init')
const catchError = require('./middleware/exception')
require('./models/user')
const app = new Koa();
app.use(catchError)
app.use(parser())
initManager.init(app)

app.listen(3000)