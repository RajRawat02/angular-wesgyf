import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[numbersOnly]'
})
export class OnlyNumberDirective {
  @Input('numbersOnly') onlyNumber: boolean;  //input flag to execute numbersOnly directive - if true ,it validates the user input
  
  constructor(private _elRef: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: any) {
    //validate the numbers ,if numbersOnly is true
    if (this.onlyNumber === true) {
      const initalValue = this._elRef.nativeElement.value;
      //numbers field should only contains numbers
      this._elRef.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
      if (initalValue !== this._elRef.nativeElement.value) {
        event.stopPropagation();
      }
    }
  }
}