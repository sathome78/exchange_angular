import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Animations} from '../../../shared/animations';

@Component({
  selector: 'app-create-account-fug',
  templateUrl: './create-account-fug.component.html',
  styleUrls: ['./create-account-fug.component.scss'],
  animations: [
    Animations.popupOverlayTrigger, Animations.popupModalTrigger
  ]
})
export class CreateAccountFugComponent implements OnInit {

  @Output() closeCreateFUGPopup = new EventEmitter<boolean>();
  @Input() showPopup;
  public step: number;


  constructor() { }

  ngOnInit() {
    this.step = 1;
  }

  onCloseCreateFUGPopup() {
    this.showPopup = false;
    setTimeout(() => {
      this.closeCreateFUGPopup.emit(true);
    }, 1000);
  }

}
