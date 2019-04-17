import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Animations} from '../../../shared/animations';

@Component({
  selector: 'app-api-key-created',
  templateUrl: './api-key-created.component.html',
  styleUrls: ['./api-key-created.component.scss'],
  animations: [
    Animations.popupOverlayTrigger, Animations.popupModalTrigger
  ]
})
export class ApiKeyCreatedComponent implements OnInit {

  @Input() showPopup;
  @Output() closeCreatedKeyPopup = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  onCloseCreatedKeyPopup() {
    this.showPopup = false;
    setTimeout(() => {
      this.closeCreatedKeyPopup.emit(true);
    }, 1000);
  }
}
