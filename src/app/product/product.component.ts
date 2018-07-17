import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  //
  private products: Array<Product>;

  private imgUrl = 'http://placehold.it/320x150';

  constructor() { }

  ngOnInit() {
    this.products = [
      new Product(1,"Product 1",1.99,3.5,"This is Product 1",["electronics","hardware"]),
      new Product(2,"Product 2",2.99,2.5,"This is Product 2",["book"]),
      new Product(3,"Product 3",3.99,4.5,"This is Product 3",["electronics","hardware"]),
      new Product(4,"Product 4",4.99,3.9,"This is Product 4",["toy"]),
      new Product(5,"Product 5",5.99,3.7,"This is Product 5",["electronics","hardware"]),
      new Product(6,"Product 6",6.99,3.2,"This is Product 6",["food"]),
    ]
  }

}

export class Product {
  constructor(
    public id:number,
    public title:string,
    public price:number,
    public rating:number,
    public desc:string,
    public categories:Array<string>
  ){}
}
