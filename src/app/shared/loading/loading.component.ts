import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  public color:any = 'accent';
  public mode:any = 'indeterminate';
  public value = 50;
  public message = "Loading..."
  constructor() {
  }

  ngOnInit(): void {
  }

}
