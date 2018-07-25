import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ProductService {
  private products: Product[] = [
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

  private comments: Comment[] = [
    new Comment(1, 1, "2018-05-05 22:22:20", "Jason", 3, "Pretty good!"),
    new Comment(2, 1, "2018-05-06 16:22:20", "Mary", 4, "Very satisfied"),
    new Comment(3, 1, "2018-05-07 21:22:20", "Willson", 5, "Pefect!"),
    new Comment(4, 2, "2018-05-04 09:22:20", "Nick", 2, "Just so so")
  ];
  constructor() {}

  getAllCategories():string[]{
    return ["electronics","hardware","book","toy","food"]
  }
  getProducts():Product[] {
    return this.products;
  }

  getProduct(id: number): Product {
    //根据商品ID从相应的列表中找出相应ID的商品，然后把信息返回回去。
    return this.products.find((product) => product.id == id);
  }

  getCommentsForProductId(id: number): Comment[] {
    //如果productId和传进来的ID是相等的，就把评论加到要返回的数组里
    return this.comments.filter((comment: Comment) => comment.productId == id);
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
