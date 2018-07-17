//在import中引入input装饰器
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.css']
})
export class StarsComponent implements OnInit {
  //@Input rating的数据由父组件传递
  //用于接收产品组件传给星级评价的数值
  @Input()
  private rating:number = 0;

  //用来显示空心或者实心的星星
  private stars: boolean[];
  constructor() { }

  ngOnInit() {
    this.stars = [];
    //将星级数值变成布尔值传入数组，从而变成显示的实心星数
    for ( let i = 1; i<=5; i++ ){
      this.stars.push(i > this.rating);
    }
    // this.stars = [false, false, true, true, true];

  }

}
