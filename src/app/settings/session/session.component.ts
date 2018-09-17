import { Component, OnInit } from '@angular/core';
import {Options} from 'ng5-slider';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent implements OnInit {

  value = 100;
  options: Options = {
    floor: 0,
    ceil: 200
  };

  constructor() { }

  ngOnInit() {
  }

}
