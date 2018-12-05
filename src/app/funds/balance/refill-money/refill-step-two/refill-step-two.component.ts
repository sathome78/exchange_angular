import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-refill-step-two',
  templateUrl: './refill-step-two.component.html',
  styleUrls: ['./refill-step-two.component.scss']
})
export class RefillStepTwoComponent implements OnInit {

  @Input() choosedName: string;

  constructor() { }

  ngOnInit() {
  }

}
