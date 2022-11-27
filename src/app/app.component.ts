import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ecomm-project';
  isShow: boolean = false;

  togglesShow(){
    this.isShow = ! this.isShow
  }
}
