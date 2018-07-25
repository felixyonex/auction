import * as express from 'express';
import {Server} from 'ws'

//app是用来声明服务器端能提供的Http服务的
const app = express();

export class Product {
  constructor(
    public id: number,
    public title: string,
    public price: number,
    public rating: number,
    public desc: string,
    public categories: Array<string>
  ) {}
}

export class Comment {
  constructor(
    public id: number,
    public productId: number,
    public timestamp: string,
    public user: string,
    public rating: number,
    public content: string
  ) {}
}

  const products: Product[] = [
    new Product(1, "Product 1", 1.99, 3.5, "This is Product 1", [
      "electronics",
      "hardware"
    ]),
    new Product(2, "Product 2", 2.99, 2.5, "This is Product 2", ["book"]),
    new Product(3, "Product 3", 3.99, 4.5, "This is Product 3", [
      "electronics",
      "hardware"
    ]),
    new Product(4, "Product 4", 4.99, 3.9, "This is Product 4", ["toy"]),
    new Product(5, "Product 5", 5.99, 3.7, "This is Product 5", [
      "electronics",
      "hardware"
    ]),
    new Product(6, "Product 6", 6.99, 3.2, "This is Product 6", ["food"])
  ];

  const comments: Comment[] = [
    new Comment(1, 1, "2018-05-05 22:22:20", "Jason", 3, "Pretty good!"),
    new Comment(2, 1, "2018-05-06 16:22:20", "Mary", 4, "Very satisfied"),
    new Comment(3, 1, "2018-05-07 21:22:20", "Willson", 5, "Pefect!"),
    new Comment(4, 2, "2018-05-04 09:22:20", "Nick", 2, "Just so so")
  ];




//服务器运行后, 在根目录下收到一个get请求, 服务器会返回一个字符串"Hello Express"
app.get('/',(req, res) => {
    res.send("Hello Express");
})

app.get('/api/products',(req,res)=>{
    //这里使用json方法
    res.json(products)
})

app.get('/api/products/:id',(req,res)=>{
    //这里使用json方法
    res.json(products.find((product)=>product.id == req.params.id))
})

app.get('/api/products/:id/comments',(req,res)=>{
    //这里使用json方法
    res.json(comments.filter((comment: Comment) => comment.productId == req.params.id));
})

const server = app.listen(8000, "localhost", ()=>{
    console.log("Server is on. The address is http://localhost:8000");
    
});

//在8085端口上创建一个服务器, 当有任何一个服务连接到这个服务器时, 给这个客户端推送一个消息.
const wsServer = new Server({port:8085});
wsServer.on("connection",websocket=>{
    websocket.send("This message is send by the server.")
})