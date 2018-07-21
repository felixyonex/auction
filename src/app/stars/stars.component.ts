//在import中引入input装饰器
import { Component, OnInit, Input, Output, OnChanges, SimpleChange, SimpleChanges } from "@angular/core";
import { EventEmitter } from "@angular/core";

@Component({
  selector: "app-stars",
  templateUrl: "./stars.component.html",
  styleUrls: ["./stars.component.css"]
})
export class StarsComponent implements OnInit, OnChanges {
  //@Input rating的数据由父组件传递
  //用于接收产品组件传给星级评价的数值
  @Input()
  private rating: number = 0;

  //输出属性, 这里必须用ratingChange命名(输入属性名+Change), 前台模板才能用rating双向绑定,否则只能手动绑定事件
  @Output()
  private ratingChange:EventEmitter<number> = new EventEmitter();

  //用来显示空心或者实心的星星
  private stars: boolean[];

  //添加属性用于判断是否是只读属性, 默认只读
  @Input()
  private readonly: boolean = true;

  constructor() {}

  ngOnInit() {
/*     this.stars = []; */
    //将星级数值变成布尔值传入数组，从而变成显示的实心星数
/*     for (let i = 1; i <= 5; i++) {
      this.stars.push(i > this.rating);
    } */
    // this.stars = [false, false, true, true, true];
  }

  ngOnChanges (changes: SimpleChanges):void {
    this.stars = [];
    for (let i = 1; i <= 5; i++) {
      this.stars.push(i > this.rating);
    }
  }

  clickStar(index: number) {
    if (!this.readonly) {
      //例如点第二个星星, 传进来的index是2
      this.rating = index + 1;
      //根据新传进来的值,重新计算下评级
      // this.ngOnInit();
      this.ratingChange.emit(this.rating);
    }
  }


}
