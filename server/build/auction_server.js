"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var ws_1 = require("ws");
//app是用来声明服务器端能提供的Http服务的
var app = express();
app.use('/', express.static(path.join(__dirname, '..', 'client')));
var Product = /** @class */ (function () {
    function Product(id, title, price, rating, desc, categories) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.rating = rating;
        this.desc = desc;
        this.categories = categories;
    }
    return Product;
}());
exports.Product = Product;
var Comment = /** @class */ (function () {
    function Comment(id, productId, timestamp, user, rating, content) {
        this.id = id;
        this.productId = productId;
        this.timestamp = timestamp;
        this.user = user;
        this.rating = rating;
        this.content = content;
    }
    return Comment;
}());
exports.Comment = Comment;
var products = [
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
var comments = [
    new Comment(1, 1, "2018-05-05 22:22:20", "Jason", 3, "Pretty good!"),
    new Comment(2, 1, "2018-05-06 16:22:20", "Mary", 4, "Very satisfied"),
    new Comment(3, 1, "2018-05-07 21:22:20", "Willson", 5, "Pefect!"),
    new Comment(4, 2, "2018-05-04 09:22:20", "Nick", 2, "Just so so")
];
//服务器运行后, 在根目录下收到一个get请求, 服务器会返回一个字符串"Hello Express"
app.get("/", function (req, res) {
    res.send("Hello Express");
});
app.get("/api/products", function (req, res) {
    var result = products;
    //传入查询参数的值. params是一个对象, key 为title, price, category
    var params = req.query;
    if (params.title) {
        result = result.filter(function (p) { return p.title.indexOf(params.title) !== -1; });
    }
    //result.length>0表示 如果经过前面过滤, result数组还有内容, 继续执行
    if (params.price && result.length > 0) {
        result = result.filter(function (p) { return p.price <= parseInt(params.price); });
    }
    if (params.category !== "-1" && result.length > 0) {
        result = result.filter(function (p) { return p.categories.indexOf(params.category) !== -1; });
    }
    //这里使用json方法
    res.json(result);
});
app.get("/api/products/:id", function (req, res) {
    //这里使用json方法
    res.json(products.find(function (product) { return product.id == req.params.id; }));
});
app.get("/api/products/:id/comments", function (req, res) {
    //这里使用json方法
    res.json(comments.filter(function (comment) { return comment.productId == req.params.id; }));
});
var server = app.listen(8000, "localhost", function () {
    console.log("Server is on. The address is http://localhost:8000");
});
//
//在这个Map里面,存了每个客户端存了哪些信息, 所以这个Map的可以是当前连接的socket, 也就是客户端那边的socket.
var subscriptions = new Map();
//在8085端口上创建一个服务器, 当有任何一个服务连接到这个服务器时, 给这个客户端推送一个消息.
var wsServer = new ws_1.Server({ port: 8085 });
//new 也可以吧这个websocket对象理解为我的客户端, 每一个客户端连接上来的时候, 都会在服务器上生成一个那个客户端对应的对象, 然后用这个对象作为key把那个客户端推上来的商品的ID放在一个map里面. Map里面存着 这个客户端关注哪些商品. 因为一个客户端可能关注多个商品, 所以value是一个id的数组. 在收到客户端收到的商品ID的消息的时候, 首先从map里去取以前客户端存的商品的id, 如果能取到, 就用这个商品的ID; 如果取不到, 也就是我从来没放进去过, 新传上来的商品id是我要放进去的第一个商品id, 这是subscription.get(websocket)就是空, 此时默认赋值成[];
wsServer.on("connection", function (websocket) {
    websocket.send("This message is send by the server.");
    //new
    websocket.on("message", function (message) {
        var messageObj = JSON.parse(JSON.stringify(message));
        //!!!!!!!!!!!!!!!!!!!!难难难点!!!!!!!!!!!!!!!!!!!!!!!!!
        var productIds = subscriptions.get(websocket) || [];
        //现在要做的就是把subscriptions再set回去, 还用websocket作为key, 值仍然是数组, 数组的元素就是之前推上来的productId,还有新推上来的productId
        subscriptions.set(websocket, productIds.concat([messageObj.productId]));
    });
});
//这个集合里面, 存的商品的最新报价,也是Map类型,key是商品id,值是商品价格
var currentBids = new Map();
//真实场景, 价格是各个客户端发上来的, 这里为了简化模型, 设置每两秒服务器自动生成新的价格
setInterval(function () {
    products.forEach(function (p) {
        //生成新的价格时,价格时不断上涨的
        //p就是products数组中的那些商品
        //如果没有最新的出价, 那么就拿去商品的价格
        var currentBid = currentBids.get(p.id) || p.price;
        var newBid = currentBid + Math.random() * 5;
        //把新的出价设置到map里面
        currentBids.set(p.id, newBid);
    });
    //new key是客户端, value是商品的id, 保存着每一个客户端保存着哪些商品
    //把subscription中关注的商品拿出来
    //这里forEach遍历的是一个Map, 因此需要传递两个参数
    subscriptions.forEach(function (productIds, ws) {
        if (ws.readyState === 1) {
            //因为一个客户端会关注好几个商品, 所以在这里推送消息的时候, 推给客户端的是一组商品的信息
            //推送过去的数组里面, 每一个元素是一个对象, 对象有两个属性:productId, bid
            //但是我们生成的是一个数组,仍然要循环当前的客户端所关注的所有的id
            //把id转换成对象
            //然后生成一个数组
            var newBids = productIds.map(function (pid) { return ({
                productId: pid,
                bid: currentBids.get(pid)
            }); });
            ws.send(JSON.stringify(newBids));
        }
        else {
            subscriptions.delete(ws);
        }
    });
}, 2000);
