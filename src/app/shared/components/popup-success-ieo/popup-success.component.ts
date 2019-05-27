import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-popup-success',
  templateUrl: './popup-success.component.html',
  styleUrls: ['./popup-success.component.scss']
})
export class PopupSuccessComponent implements OnInit {

  @Input() IEOName: string = '';
  @Output() close: EventEmitter<any> = new EventEmitter();

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

  closeMe() {
    this.close.emit();
  }

  closeMeAndRedirect() {
    this.closeMe();
    this.router.navigateByUrl('/funds/balances?tab=ieo');
  }
}
