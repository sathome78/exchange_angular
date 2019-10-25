import { trigger, state, style, animate, transition } from '@angular/animations';
import { translateInfo } from './configs/translate-options';

export const Animations = {
  popupOverlayTrigger: trigger('overlayAnimation', [
    state(
      'show',
      style({
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
      })
    ),
    state(
      'hide',
      style({
        backgroundColor: 'transparent',
      })
    ),
    transition(':enter', [animate('0s linear')]),
    transition(':leave', [animate('0.2s linear')]),
  ]),
  popupModalTrigger: trigger('modalAnimation', [
    // ...
    state(
      'show',
      style({
        right: 0,
      })
    ),
    state(
      'hide',
      style({
        right: '-900px',
      })
    ),
    transition('*=>show', [animate('0.4s linear')]),
    transition('*=>hide', [animate('0.4s linear')]),
  ]),

  componentTriggerShow: trigger('showAnimation', [
    state(
      'show',
      style({
        opacity: 1,

      })
    ),
    state(
      'hide',
      style({
        opacity: 0,

      })
    ),
    transition('*=>show', [animate('.3s cubic-bezier(.35, 0, .25, 1)', style({opacity:1}))]),
    transition('*=>hide', [animate('0s', style({opacity:0}))]),
  ]),

  componentTriggerMove: trigger('MoveAnimation', [
    state(
      'show',
      style({
        top: 0,
      })
    ),
    state(
      'hide',
      style({
        top: '50px',
      })
    ),
    transition('*=>show', [animate('.5s cubic-bezier(.35, 0, .25, 1)', style({top: 0}))]),
    transition('*=>hide', [animate('0s cubic-bezier(.35, 0, .25, 1)', style({top: '50px'}))]),
  ]),
  componentTriggerShowOrderBook: trigger('showOrderBook', [
  state(
    'show',
    style({
      opacity: 1,
      transform: 'translateY(0)'

    })
  ),
  state(
    'hide',
    style({
      opacity: 0,
      transform: 'translateY(15px)'
    })
  ),
  transition('*=>show', [animate('.5s ease-out', style({opacity:1,transform: 'translateY(0)'}))]),
  transition('*=>hide', [animate('.0s', style({opacity:0,transform: 'translateY(15px)'}))]),
]),

componentTriggerBallanceAnimation: trigger('ballanceAnimation', [
  state(
    'show',
    style({
      opacity: 1,
      transform: 'translateY(0)'

    })
  ),
  state(
    'hide',
    style({
      opacity: 0,
      transform: 'translateY(15px)'
    })
  ),
  transition('*=>show', [animate('.5s ease-out', style({opacity:1,transform: 'translateY(0)'}))]),
  transition('*=>hide', [animate('.5s', style({opacity:0,transform: 'translateY(15px)'}))]),
]),
};



