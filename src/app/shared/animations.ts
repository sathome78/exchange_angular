import {trigger, state, style, animate, transition,} from '@angular/animations';

export const Animations = {
  popupOverlayTrigger: trigger('overlayAnimation', [
    state('show', style({
      backgroundColor: 'rgba(0, 0, 0, 0.85)'
    })),
    state('hide', style({
      backgroundColor: 'transparent'
    })),
    transition(':enter', [
      animate('0s linear')
    ]),
    transition(':leave', [
      animate('0.2s linear')
    ]),
  ]),
  popupModalTrigger: trigger('modalAnimation', [
    // ...
    state('show', style({
      right: 0
    })),
    state('hide', style({
      right: '-900px'
    })),
    transition(':enter', [
      animate('0.4s linear')
    ]),
    transition(':leave', [
      animate('0.4s linear')
    ]),
  ]),
}
