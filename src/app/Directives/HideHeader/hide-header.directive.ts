import {Directive, ElementRef, HostListener, Input, OnInit, Renderer} from '@angular/core';

@Directive({
  selector: '[appHideHeader]'
})
export class HideHeaderDirective implements OnInit {
  @Input('appHideHeader') header: HTMLElement;
  headerHeight;
  scrollContent;
  constructor(public element: ElementRef, public renderer: Renderer) { }
  ngOnInit() {
    this.headerHeight = this.header.clientHeight;
    this.renderer.setElementStyle(this.header, 'webkitTransition', 'top 700ms');
    this.scrollContent = this.element.nativeElement.getElementsByClassName('scroll-content')[0];
    this.renderer.setElementStyle(this.scrollContent, 'webkitTransition', 'margin-top 700ms');
  }
  @HostListener('ionScroll', ['$event']) ionScroll(event) {
    if (event.scrollTop > 56) {
      this.renderer.setElementStyle(this.header, 'top', '-56px');
      this.renderer.setElementStyle(this.scrollContent, 'margin-top', '0px');
    } else {
      this.renderer.setElementStyle(this.header, 'top', '0px');
      this.renderer.setElementStyle(this.scrollContent, 'margin-top', '56px');
    }
  }
}
