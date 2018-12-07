import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-send-successful',
  templateUrl: './send-successful.component.html',
  styleUrls: ['./send-successful.component.scss']
})
export class SendSuccessfulComponent implements OnInit {

  @Input() data;
  @Input() choosedName: string;
  @Output() closeMe = new EventEmitter();
  public operationName;
  public isSowCopyAddress = false;
  constructor() { }

  ngOnInit() {
    console.log(this.choosedName);
    console.log(this.data)
    this.operationName = this.data.operationName;
    console.log(this.operationName);
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
      case 'Copy address':
        this.isSowCopyAddress = true;
        setTimeout(() => this.isSowCopyAddress = false, 1000);
        break;
    }
  }
}
