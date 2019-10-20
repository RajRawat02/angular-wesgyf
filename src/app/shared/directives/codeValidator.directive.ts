import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[codeValidator]'
})
export class CodeValidatorDirective {
  @Input('codeValidator') codeValidator: boolean; //input flag to execute codeValidator directive - if true ,it validates the user input

  constructor(private _elRef: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: any) {
    //validates the code field ,if codeValidator is true 
    if (this.codeValidator == true) {
      if (this._elRef.nativeElement.value.match(/[^a-zA-Z0-9]+/g)) {
        // code field should only contains numbers and alphabets 
        this._elRef.nativeElement.value = this._elRef.nativeElement.value.replace(/[^a-zA-Z0-9]+/g, '')
      }
    }
  }
}