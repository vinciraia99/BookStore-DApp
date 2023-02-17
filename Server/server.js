const jsonServer = require('json-server');
const middleware = jsonServer.defaults();
const server = jsonServer.create( );


server. use(middleware) ;
server.use(jsonServer.bodyParser)

const userData = require("./index");

server.get('/api/books',(req,res,next) =>{
  res.status(200).send(userData.getBooks);
})

server.listen(3000, ()=>{
  console.log("Json attivo 3000");
})
