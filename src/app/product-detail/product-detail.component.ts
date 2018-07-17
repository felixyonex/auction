import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
//商品详情控制器组件
export class ProductDetailComponent implements OnInit {

  productTitle: string;
  //ActivatedRoute 保存当前路由信息的对象
  constructor(private routeInfo: ActivatedRoute) { }

  ngOnInit() {
    this.productTitle = this.routeInfo.snapshot.params["prodTitle"]
  }

}
