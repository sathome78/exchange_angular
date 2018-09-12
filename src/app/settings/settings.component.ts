import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {


  constructor(private router: Router) {
    this.router.navigate(['/settings/two-factor-auth']);
  }

  ngOnInit() {
  }

  onUpdateProviderSetting(event: string) {
    console.log('event: ' + event);
  }

}
