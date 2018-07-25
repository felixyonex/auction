import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../shared/product.service';
import { FormControl } from '../../../node_modules/@angular/forms';
import "../../../node_modules/rxjs";
import { Observable } from '../../../node_modules/rxjs';
// import "../../../node_modules/rxjs/add/operator/debounceTime";


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  //改造成流
  private products: Observable<Product[]>;

  // private keyword:string;

  // private titleFilter:FormControl = new FormControl;

  private imgUrl = 'http://placehold.it/320x150';

  constructor(private productService: ProductService) { 

    // //这里使用debouceTime总是报错
    // this.titleFilter.valueChanges
    // .subscribe(
    //   value => this.keyword = value
    // )

  }

  ngOnInit() {

    this.products = this.productService.getProducts();
  }

}


