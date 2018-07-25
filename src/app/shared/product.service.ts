import { Injectable } from "@angular/core";
import { Http } from "../../../node_modules/@angular/http";
import { Observable } from "../../../node_modules/rxjs";
import { map } from "../../../node_modules/rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class ProductService {

  //注入http服务
  constructor(private http:Http) {

  }

  getAllCategories():string[]{
    return ["electronics","hardware","book","toy","food"]
  }
  getProducts():Observable<Product[]> {
    return this.http.get("/api/products").pipe(map(res => res.json()));
  }

  getProduct(id: number): Observable<Product> {
    //根据商品ID从相应的列表中找出相应ID的商品，然后把信息返回回去。
    return this.http.get("/api/products/" + id).pipe(map(res => res.json()));
  }

  getCommentsForProductId(id: number): Observable<Comment[]> {
    //如果productId和传进来的ID是相等的，就把评论加到要返回的数组里
    return this.http.get("/api/products/" + id +"/comments").pipe(map(res => res.json()));
  }
}

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

//Declare a class to encapsulate the comments of the product
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
