import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BY_PRIVATE_CODE, COPY_ADDRESS, TRANSFER_INSTANT, SEND_CRYPTO, SEND_FIAT} from '../send-money-constants';

@Component({
  selector: 'app-send-successful',
  templateUrl: './send-successful.component.html',
  styleUrls: ['./send-successful.component.scss']
})
export class SendSuccessfulComponent implements OnInit {

  @Input() data;
  @Input() choosedName: string;
  @Output() closeMe = new EventEmitter();
  public BY_PRIVATE_CODE = BY_PRIVATE_CODE;
  public TRANSFER_INSTANT = TRANSFER_INSTANT;
  public COPY_ADDRESS = COPY_ADDRESS;
  public SEND_CRYPTO = SEND_CRYPTO;
  public SEND_FIAT = SEND_FIAT;
  public operationName;
  public isSowCopyAddress = false;
  constructor() { }

  ngOnInit() {
    // console.log(this.data);
  }

  onClose() {
    this.closeMe.emit();
  }

  /**
   * copy data to buffer
   * @param {string} val
   */
  copyToBuffer(val: string, btn: string) {
    this.changeCopyBtn(btn);
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  private changeCopyBtn (name: string) {
    switch (name) {
      case COPY_ADDRESS:
        this.isSowCopyAddress = true;
        setTimeout(() => this.isSowCopyAddress = false, 1000);
        break;
    }
  }
}
