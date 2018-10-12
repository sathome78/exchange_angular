import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
  isSubmitSuccessful = false;
  submitEventSubject: Subject<string> = new Subject<string>();
  @Output() onNextStep = new EventEmitter<number>();

  @Input('formEntity') formEntity;

  displayMode = this.STEP;

  constructor() {
  }

  ngOnInit() {

    console.log('entity: ' + JSON.stringify(this.formEntity));
  }

  toggleWebcam() {
    this.displayMode = this.WEBCAM;
    console.log(this.displayMode);
  }

  toggleFile() {
    this.displayMode = this.FILE;
    console.log(this.displayMode);
  }

  onSubmit(mode: string) {
    this.submitEventSubject.next(mode);
    setTimeout(this.moveNext(), 3);
  }

  moveNext() {
    if (this.isSubmitSuccessful) {
      this.onNextStep.emit(3);
    }
  }


  processSubmitResult(code: any) {

  }
}
