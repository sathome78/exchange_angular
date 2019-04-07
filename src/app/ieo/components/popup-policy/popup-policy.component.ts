import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
// import {PopupService} from '../../shared/services/popup.service';
// import {PopupData} from '../../shared/interfaces/popup-data-interface';

@Component({
  selector: 'app-popup-policy',
  templateUrl: './popup-policy.component.html',
  styleUrls: ['./popup-policy.component.scss']
})
export class PopupPolicyComponent implements OnInit {

  @Input() show: boolean;
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() onAgree: EventEmitter<any> = new EventEmitter();

  constructor(

  ) { }

  ngOnInit() {
  }

  closeMe() {
    this.close.emit();
  }
}
