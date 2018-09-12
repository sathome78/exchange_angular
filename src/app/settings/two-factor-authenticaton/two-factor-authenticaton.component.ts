import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-two-factor-authenticaton',
  templateUrl: './two-factor-authenticaton.component.html',
  styleUrls: ['./two-factor-authenticaton.component.css']
})
export class TwoFactorAuthenticatonComponent implements OnInit {

  @Output() providerSettingsEmitter: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  updateAuthProviderSettings(value: string) {
    console.log(value);
    this.providerSettingsEmitter.emit(value);
  }

}
