import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-qubera-mob-details',
  templateUrl: './qubera-mob-details.component.html',
  styleUrls: ['./qubera-mob-details.component.scss']
})
export class QuberaMobDetailsComponent implements OnInit {

  constructor(
    private location: Location,
  ) { }

  ngOnInit() {
  }

  public onGoBackToMain(): void {
    this.location.back();
  }

}
