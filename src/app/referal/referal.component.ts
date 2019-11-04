import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-referal',
  templateUrl: './referal.component.html',
  styleUrls: ['./referal.component.scss']
})
export class ReferalComponent implements OnInit {
  public user = 'auth';
  public tab = 'referal-structure'

  constructor() { }

  ngOnInit() {
    
  }

}
