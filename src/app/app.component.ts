import { Component } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Angular Intro and Practise';

  constructor() {
    console.log("Wechat account is " + environment.wechatAccount);
    
  }
}
