import { Component, OnInit } from '@angular/core';
import { ObjectUnsubscribedError } from 'rxjs';

@Component({
  selector: 'app-unsubscribe',
  templateUrl: './unsubscribe.component.html',
  styleUrls: ['./unsubscribe.component.scss']
})
export class UnsubscribeComponent implements OnInit {
  public subscribed  = false;
  constructor() { }

  ngOnInit() {
    
  }
  resubscribedTxt(){
  this.subscribed = true;

}
}
