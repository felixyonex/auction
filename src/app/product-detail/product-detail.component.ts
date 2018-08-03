import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Product, ProductService, Comment } from "../shared/product.service";
import { WebSocketService } from "../shared/web-socket.service";
import { Subscription } from "../../../node_modules/rxjs";

@Component({
  selector: "app-product-detail",
  templateUrl: "./product-detail.component.html",
  styleUrls: ["./product-detail.component.css"]
})
//商品详情控制器组件
export class ProductDetailComponent implements OnInit {
  // productTitle: string;
  product: Product;

  //Store the info we get from the Service
  comments: Comment[];
  //ActivatedRoute 保存当前路由信息的对象

  //用于保存星级和评价内容
  newRating: number = 5;
  newComment: string = "";

  //评论部分是否可见, 默认隐藏.
  isCommentHidden = true;

  //表明是否关注了该商品
  isWatched: boolean = false;
  currentBid: number;

  //new:表明当前订阅
  subscription: Subscription;

  constructor(
    private routeInfo: ActivatedRoute,
    private productService: ProductService,
    private wsService: WebSocketService
  ) {}

  ngOnInit() {
    let productId: number = this.routeInfo.snapshot.params["productId"];

    //从参数快照中获得商品的ID
    // this.product = this.productService.getProduct(productId);
    // this.productTitle = this.routeInfo.snapshot.params["prodTitle"]

    //对于product, 因为模板上有太多绑定product, 因此只是在ngOnInit中手动订阅这个流
    this.productService.getProduct(productId).subscribe(
      // 当流里面发射一个新的数据的时候它的处理方法, 把流的值赋给本地变量product
      product => {
        this.product = product;
        //new
        this.currentBid = product.price;
      }
    );

    this.productService
      .getCommentsForProductId(productId)
      .subscribe(comments => (this.comments = comments));
  }

  addComment() {
    let comment = new Comment(
      0,
      this.product.id,
      new Date().toISOString(),
      "someone",
      this.newRating,
      this.newComment
    );

    this.comments.unshift(comment);

    //reduce方法, 遍历, (回调函数, 初始值)
    let sum = this.comments.reduce((sum, comment) => sum + comment.rating, 0);

    this.product.rating = sum / this.comments.length;

    //重置表单
    this.newComment = null;
    this.newRating = 5;
    this.isCommentHidden = true;
  }

  watchProduct() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.isWatched = false;
      this.subscription = null;
    } else {
      this.isWatched = true;
      //new 在创建连接时,如何把一个productId发送给服务器
      //把参数传到createOberservableSocket
      //new
      this.subscription = this.wsService
        .createOberservableSocket("ws://localhost:8085", this.product.id)
        .subscribe(
          products => {
          //find查找条件是productId==当前页面商品显示的Id
          let product = products.find(p => p.productId == this.product.id);
          this.currentBid = product.bid;
        });
    }
  }
}
