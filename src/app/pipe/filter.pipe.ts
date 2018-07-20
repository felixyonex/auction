import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  //list,当前的商品列表;filterField根据商品哪个字段过滤;用户输入的关键字
  transform(list:any[], filterField:string, keyword:string): any {
    if (! filterField || !keyword){
      return list;
    }
    return list.filter( item => {
      let fieldValue = item[filterField];
      return fieldValue.indexOf(keyword) >= 0;
    });
  }

}
