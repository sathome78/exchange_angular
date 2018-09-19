import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import {Observable, Subject} from 'rxjs';

@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.scss']
})
export class StepTwoComponent implements OnInit {

  WEBCAM = 'WEBCAM';
  FILE = 'FILE';
  STEP = 'STEP';

  @Output() onNextStep = new EventEmitter<number>();

  displayMode = this.STEP;

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    this.onNextStep.emit(3);
  }

  toggleWebcam() {
    this.displayMode = this.WEBCAM;
    console.log(this.displayMode);
  }

  toggleFile() {
    this.displayMode = this.FILE;
    console.log(this.displayMode);
  }

}
