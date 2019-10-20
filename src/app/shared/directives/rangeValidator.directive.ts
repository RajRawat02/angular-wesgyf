import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[rangeValidator]'
})
export class RangeValidatorDirective {
  @Input('rangeValidator') rangeValidator: boolean; //input flag to execute rangeValidator directive - if true ,it validates the user input
  @Input() min : any; //input property - contains minimum value
  @Input() max : any; //input property - contains maximum value

  constructor(private _elRef: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: any) {
     if (this.rangeValidator == true) {
       //validates the range ,if rangeValidator is true - max value should be greater than min value
      if ( this._elRef.nativeElement.value != "") {
        const initalValue = this._elRef.nativeElement.value;
        //validate integer values
        if (parseInt( this._elRef.nativeElement.value) < parseInt(this.min)) {
          this._elRef.nativeElement.value = "";
          event.stopPropagation();
        }
        //validate float values
        if (parseInt( this._elRef.nativeElement.value) >parseInt(this.max)) {
          this._elRef.nativeElement.value = "";
          event.stopPropagation();
        }
      }
    }
  }
}