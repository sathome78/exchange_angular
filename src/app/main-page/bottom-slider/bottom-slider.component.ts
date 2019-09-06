import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bottom-slider',
  templateUrl: './bottom-slider.component.html',
  styleUrls: ['./bottom-slider.component.scss']
})
export class BottomSliderComponent implements OnInit {
  public slides = [];
  public currSlide = '0';
  public slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    appendArrows: document.getElementsByClassName('bottom-arrows-container')
  };
  constructor() { }

  ngOnInit() {
  }
  afterChange(e) {
    let currSlideNumber =  document.querySelector(".bottom-slider .slick-current.slick-active").getAttribute('data-slick-index');
    this.currSlide = currSlideNumber;
    console.log(currSlideNumber)
  }
}
