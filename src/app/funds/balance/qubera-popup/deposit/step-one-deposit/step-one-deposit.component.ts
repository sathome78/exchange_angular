import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-step-one-deposit',
  templateUrl: './step-one-deposit.component.html',
  styleUrls: ['./step-one-deposit.component.scss']
})
export class StepOneDepositComponent implements OnInit {

  constructor() { }

  form: FormGroup;
  @ViewChild('content') content: ElementRef;

  ngOnInit() {
    this.initForm()
  }


  initForm() {
    this.form = new FormGroup({
      amount: new FormControl('')
    });
  }

  download() { 
    let data = document.getElementById('pdf-download');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      let imgWidth = 208;
      let pageHeight = 295;
      let imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      let position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('kp.pdf'); // Generated PDF
    });

  }

}
