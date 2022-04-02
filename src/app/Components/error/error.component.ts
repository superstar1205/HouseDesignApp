import {Component, Input} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  animations: [
    trigger('label', [
      transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate('300ms ease-out')
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({transform: 'translateY(-100%)'}))
      ])
    ])
  ]
})
export class ErrorComponent {
  @Input() public errorMsg = '';
  @Input() public colorClass = '_danger';
  constructor() { }

}
