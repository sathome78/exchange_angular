import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
// import {PopupService} from '../../shared/services/popup.service';
// import {PopupData} from '../../shared/interfaces/popup-data-interface';

@Component({
  selector: 'app-popup-success',
  templateUrl: './popup-success.component.html',
  styleUrls: ['./popup-success.component.scss']
})
export class PopupSuccessComponent implements OnInit {

  @Input() show: boolean;
  @Output() close: EventEmitter<any> = new EventEmitter();

  constructor(

  ) { }

  ngOnInit() {
  }

  closeMe() {
    this.close.emit();
  }
}
