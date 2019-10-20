import { Directive, ElementRef, HostListener, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[appAutofocus]'
})
export class AutofocusDirective {

  constructor(private el: ElementRef, private rd: Renderer2) {
  }

  @Input("appAutofocus") focusindex: number = 0;

  @HostListener('keydown', ['$event']) onKeyDown(e: any) {
    if ((e.which == 13 || e.keyCode == 13)) {
      e.preventDefault();
      let control: any;
      control=document.querySelector(`[ng-reflect-focusindex="${+this.focusindex+1}"]`);
      if (control && !control.hidden) {
        control.focus();
      }
    }
  }
}
