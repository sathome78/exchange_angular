import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ieo-description2',
  templateUrl: './ieo-description2.component.html',
  styleUrls: ['./ieo-description2.component.scss']
})
export class IeoDescription2Component implements OnInit {
  @Input('ieoToken') public ieoToken = null;

  constructor() { }

  ngOnInit() {
  }

}
