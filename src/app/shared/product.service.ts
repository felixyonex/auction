import { Injectable, EventEmitter, } from "@angular/core";
//注意,之前出现了bug, 因为没有引用URLSearchParams包
import { Http, URLSearchParams } from "../../../node_modules/@angular/http";
import { Observable } from "../../../node_modules/rxjs";
import { map } from "../../../node_modules/rxjs/operators";
//引用错误!
// import { EventEmitter } from "../../../node_modules/protractor";
// import { EventEmitter } from "@angular/core";
//将上面引用和第一条合并

@Injectable({
  providedIn: "root"
})
export class ProductService {

//搜索按钮事件
  searchEvent:EventEmitter<ProductSearchParams> = new EventEmitter();

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

  search (params: ProductSearchParams): Observable<Product[]> {
    //这里需要自己写一个encodeParams方法, 把参数传进去
    return this.http.get("/api/products",{search: this.encodeParams(params)}).pipe(map(res => res.json()));
  }

//!!!!!!!!!!!!!!!!!!!难点!!!!!!!!!!!!!!!!!!!!
  private encodeParams(params: ProductSearchParams) {
    // let result:URLSearchParams;

    //把对象中的所有key取出来成为一个集合
    //过滤:判断的依据就是当前的这个对象里面这个属性是不是有值, 有值的话就留下来, 没有值就过滤掉
    return Object.keys(params)
    .filter(key => params[key])
    .reduce((sum:URLSearchParams, key:string) => {
      //URLSearchParams是一个对象, 封装了?key=value格式的字符串
      //第一个参数: 查询参数的名字; 第二个参数: 查询参数的值
      sum.append(key, params[key]);
      return sum;
    }, new URLSearchParams());//注意最后的括号!!
    // return result;
  }

}

export class ProductSearchParams {
  constructor (public title:string,
              public price:number,
              public category:string
  ){}
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
