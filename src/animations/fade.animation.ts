import {animate, state, style, transition, trigger} from '@angular/animations';

export const fade = trigger('fade', [
  state('*', style({
    opacity: 1
  })),
  transition('void => *', [
    style({
      opacity: 0
    }),
    animate('300ms ease-in')
  ]),
  transition('* => void', [
    animate('400ms 200ms ease-out', style({
      opacity: 0
    }))
  ])
]);
