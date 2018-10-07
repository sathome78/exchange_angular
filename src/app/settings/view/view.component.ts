import {Component, OnInit} from '@angular/core';
import {SettingsService} from '../settings.service';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  public isLowColorModeEnabled = false;

  constructor(private settingsService: SettingsService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.userService.getUserColorEnabled()
      .subscribe(enabled => {
          this.isLowColorModeEnabled = enabled;
        },
        err => {
          console.log(err);
        });
  }

  toggleLowColorMode() {
    this.isLowColorModeEnabled = !this.isLowColorModeEnabled;
    this.settingsService.updateUserColorDepth(this.isLowColorModeEnabled)
      .subscribe(result => {
          console.log(result);
        },
        err => {
          console.log(err);
        });
  }
}
