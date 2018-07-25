"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var ws_1 = require("ws");
//app是用来声明服务器端能提供的Http服务的
var app = express();
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
app.get('/', function (req, res) {
    res.send("Hello Express");
});
app.get('/api/products', function (req, res) {
    //这里使用json方法
    res.json(products);
});
app.get('/api/products/:id', function (req, res) {
    //这里使用json方法
    res.json(products.find(function (product) { return product.id == req.params.id; }));
});
app.get('/api/products/:id/comments', function (req, res) {
    //这里使用json方法
    res.json(comments.filter(function (comment) { return comment.productId == req.params.id; }));
});
var server = app.listen(8000, "localhost", function () {
    console.log("Server is on. The address is http://localhost:8000");
});
//在8085端口上创建一个服务器, 当有任何一个服务连接到这个服务器时, 给这个客户端推送一个消息.
var wsServer = new ws_1.Server({ port: 8085 });
wsServer.on("connection", function (websocket) {
    websocket.send("This message is send by the server.");
});
