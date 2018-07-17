import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { Product, ProductService, Comment } from '../shared/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
//商品详情控制器组件
export class ProductDetailComponent implements OnInit {

  // productTitle: string;
  product: Product;

  //Store the info we get from the Service
  comments: Comment[];
  //ActivatedRoute 保存当前路由信息的对象
  constructor(private routeInfo: ActivatedRoute,
  private productService: ProductService) { }

  ngOnInit() {
    let productId:number = this.routeInfo.snapshot.params["productId"]

    //从参数快照中获得商品的ID
    this.product = this.productService.getProduct(productId);
    // this.productTitle = this.routeInfo.snapshot.params["prodTitle"]

    this.comments = this.productService.getCommentsForProductId(productId);
  }

}
