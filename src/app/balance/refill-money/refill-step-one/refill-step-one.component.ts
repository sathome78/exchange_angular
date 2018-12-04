import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-refill-step-one',
  templateUrl: './refill-step-one.component.html',
  styleUrls: ['./refill-step-one.component.scss']
})
export class RefillStepOneComponent implements OnInit {

  @Output() chooseRefill = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onChooseRefill(name: string) {
    this.chooseRefill.emit(name);
  }

}
