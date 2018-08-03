import { Injectable } from "@angular/core";
import { Observable, pipe } from "../../../node_modules/rxjs";
import { map } from "../../../node_modules/rxjs/operators";

@Injectable()
export class WebSocketService {
  ws: WebSocket;

  constructor() {}
  //new 把id传进去
  createOberservableSocket(url: string, id: number): Observable<any> {
    //这个对象会根据传进来的url去连接到指定的WebSocket服务器
    this.ws = new WebSocket(url);
    //这里增加泛型<sting>
    return new Observable<string>(
      observer => {
        //当WebSocket收到消息的时候, 流要发送下一个元素
        //next发射的元素是websocket接收到的事件里面包含的数据
        this.ws.onmessage = (event) => observer.next(event.data);
        this.ws.onerror = (event) => observer.error(event);
        this.ws.onclose = (event) => observer.complete();
        //new 当连接打开时,调用自身sendMessage方法, 把商品ID发过去
        this.ws.onopen = (event) => this.sendMessage({productId:id});
        //new 返回一个匿名函数, 会在subscription.unsubscribe()调用的时候被调用
        return () => this.ws.close();
      }
      //这里做一个映射,把字符串消息用JSON转成对象
    ).pipe(
      map(message => {
        JSON.parse(JSON.stringify(message));
      })
    );
  }

  //用websocket发一个消息
  //new 把类型从string 改成any
  sendMessage(message: any) {
    // this.ws.send(message);
    this.ws.send(JSON.stringify(message));
  }
}
