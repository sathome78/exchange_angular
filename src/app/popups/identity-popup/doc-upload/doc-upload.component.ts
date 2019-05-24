import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-doc-upload',
  templateUrl: './doc-upload.component.html',
  styleUrls: ['./doc-upload.component.scss'],
})
export class DocUploadComponent implements OnInit, OnDestroy {

  @Output() showFile = new EventEmitter<boolean>();
  @Output() submitResult = new EventEmitter<number>();

  @Input() events: Observable<string>;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  fileToUpload: File = null;
  url = '';

  constructor() {
  }

  ngOnInit() {

    this.events
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(mode => {
        if (mode === 'FILE') {
        // todo smth useful
        // console.log('submit clicked for file');
        }
      });
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      this.fileToUpload = event.target.files[0];

      if (this.isFileValid()) {
        reader.readAsDataURL(this.fileToUpload); // read file as data url

        reader.onload = (ev: any) => { // called once readAsDataURL is completed
          this.url = ev.target.result;
        };
      } else {
        this.fileToUpload = null;
      }

    }
  }

  isFileValid(): boolean {
    if (this.fileToUpload == null) {
      return false;
    }
    const fileName = this.fileToUpload.name.toLowerCase();
    return fileName.endsWith('.png'.toLowerCase())
      || fileName.endsWith('.jpg'.toLowerCase())
      || fileName.endsWith('.jpeg'.toLowerCase())
      || fileName.endsWith('.tif'.toLowerCase())
      || fileName.endsWith('.gif'.toLowerCase());
  }

  notifyResult() {
    this.submitResult.next(55);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
