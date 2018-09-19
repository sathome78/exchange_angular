import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-doc-upload',
  templateUrl: './doc-upload.component.html',
  styleUrls: ['./doc-upload.component.scss']
})
export class DocUploadComponent implements OnInit {

  @Output() showFile = new EventEmitter<boolean>();
  fileToUpload: File = null;

  constructor() { }

  ngOnInit() {
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

}
