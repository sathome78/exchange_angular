import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss']
})
export class StepOneComponent implements OnInit {

  @Output() onNextStep = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

  moveNext() {
    this.onNextStep.emit(2);
  }

  onSubmit() {
    this.moveNext();
  }

}
