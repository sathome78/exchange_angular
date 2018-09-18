import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.scss']
})
export class StepTwoComponent implements OnInit {

  @Output() onNextStep = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    this.onNextStep.emit(3);
  }

}
