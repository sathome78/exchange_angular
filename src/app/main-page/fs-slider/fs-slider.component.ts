import { Component, OnInit } from '@angular/core';
import { PopupService } from 'app/shared/services/popup.service';

@Component({
  selector: 'app-fs-slider',
  templateUrl: './fs-slider.component.html',
  styleUrls: ['./fs-slider.component.scss']
})
export class FsSliderComponent implements OnInit {
  public activeBlock = false;
  public slides = [];
  public currSlide = '0';
  public slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    appendArrows: document.getElementsByClassName('arrows-container'),
    // dots: false,
  };
  public email: string;
  constructor(private popupService: PopupService) { }

  ngOnInit() {
    setTimeout(() => {
      this.activeBlock = true;
    }, 2000)
  }

  afterChange(e) {
    const currSlideNumber = document
      .querySelector('.fs-slider-container .slick-current.slick-active')
      .getAttribute('data-slick-index');
    this.currSlide = currSlideNumber;
  }

  openRegistration() {
    if (this.email) {
      this.popupService.showMobileRegistrationPopup(true, this.email);
    }
  }
}
