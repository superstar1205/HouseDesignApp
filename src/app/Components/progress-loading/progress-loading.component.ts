import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-progress-loading',
  templateUrl: './progress-loading.component.html',
  styleUrls: ['./progress-loading.component.scss'],
})
export class ProgressLoadingComponent {
  @Input() public progressBar = false;
  @Input() public heightOnly = false;
  @Input() public pColorClass = 'myProgressBar';
  constructor() { }
}
