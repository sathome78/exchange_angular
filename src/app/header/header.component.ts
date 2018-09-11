import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public isMobileMenuOpen = false;

  constructor() { }

  ngOnInit() {
  }

  public openMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    console.log('Open mobile menu');
  }


}
