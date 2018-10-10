import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  // host: {'class': 'app-settings'}
})
export class SettingsComponent implements OnInit {


  constructor(private router: Router,
              private authService: AuthService) {
    const path = authService.isAuthenticated() ? '/settings/two-factor-auth' : '/';
    // this.router.navigate([path]);
  }

  ngOnInit() {
  }

}
