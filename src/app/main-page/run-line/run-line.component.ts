import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-run-line',
  templateUrl: './run-line.component.html',
  styleUrls: ['./run-line.component.scss']
})
export class RunLineComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    function runInit() {
      let runItemArray = document.querySelectorAll('.run-line-item');
      let that = this;
      let lineLength = runItemArray.length * document.querySelector('.run-line-item').clientWidth;
      runItemArray.forEach(function (item) {

        let changePosition = parseFloat(item.getAttribute("data-position")) - 0.7;
        item.setAttribute("data-position", `${changePosition}`);
        item.setAttribute("style", `transform:translateX(${changePosition}px)`);
        if(item.getBoundingClientRect().left + item.clientWidth < 0){
          item.setAttribute("data-position", `${changePosition + lineLength}`);
          item.setAttribute("style", `transform:translateX(${changePosition + lineLength}px)`);
          
        }
      })
      window.requestAnimationFrame(runInit)
    }
    setTimeout(function () {
      window.requestAnimationFrame(runInit);
    }, 1500)

  }

}
