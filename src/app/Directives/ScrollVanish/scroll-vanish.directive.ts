import {Directive, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {DomController} from '@ionic/angular';

@Directive({
  selector: '[appScrollVanish]'
})
export class ScrollVanishDirective implements OnInit {
  @Input('appScrollVanish') scrollArea;

  private hidden = false;
  private triggerDistance = 56;

  constructor(private element: ElementRef,
              private renderer: Renderer2,
              private domCtrl: DomController) {}
  ngOnInit() {
    /*if (this.scrollArea) {
      this.initStyles();
      this.scrollArea.ionScroll.subscribe(scrollEvent => {
        const delta = scrollEvent.detail.deltaY;

        if (scrollEvent.detail.currentY === 0 && this.hidden) {
          this.show();
        } else if (!this.hidden && delta > this.triggerDistance) {
          this.hide();
        } else if (this.hidden && delta < -this.triggerDistance) {
          this.show();
        }
      });
    }*/
  }

  initStyles() {
    this.domCtrl.write(() => {
      this.renderer.setStyle(
          this.element.nativeElement,
          'transition',
          '0.2s linear'
      );
      this.renderer.setStyle(this.element.nativeElement, 'height', '56px');
    });
  }

  hide() {
    this.domCtrl.write(() => {
      this.renderer.setStyle(this.element.nativeElement, 'height', '0px');
      this.renderer.setStyle(this.element.nativeElement, 'opacity', '0');
      this.renderer.setStyle(this.element.nativeElement, 'padding', '0');
    });
    this.hidden = true;
  }

  show() {
    this.domCtrl.write(() => {
      this.renderer.setStyle(this.element.nativeElement, 'height', '56px');
      this.renderer.removeStyle(this.element.nativeElement, 'opacity');
      this.renderer.removeStyle(this.element.nativeElement, 'padding');
    });
    this.hidden = false;
  }
}
