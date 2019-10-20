import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[textValidator]'
})
export class TextValidatorDirective {
  @Input('textValidator') textValidator: boolean; //input flag to execute textValidator directive - if true ,it validates the user input
 
  constructor(private _elRef: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: any) {
     if (this.textValidator == true) {
       //validates the text field ,if textValidator is true - text field should only contains alphabets
        if ( this._elRef.nativeElement.value.match(/[^a-zA-Z0-9-_ ]+/g)) {
            this._elRef.nativeElement.value =  this._elRef.nativeElement.value.replace(/[^a-zA-Z0-9-_ ]/g, '')
           
          }
    }
  }
}