import { Directive, ElementRef, HostListener, Renderer2, Input } from '@angular/core';

@Directive({
    selector: '[inputAutofocus]'
})
export class InputAutofocusDirective {

    constructor(private el: ElementRef, private rd: Renderer2) {
    }

    @Input("inputAutofocus") focusindex: number = 0;

    @HostListener('keydown', ['$event']) onKeyDown(e: any) {
        if ((e.which == 13 || e.keyCode == 13)) {
            e.preventDefault();
            let control: any;
            //Element ids are set to field0,field1...etc based on focusindex
            control = document.querySelector('#field' + (this.focusindex + 1));
            if (control && !control.hidden) {
                control.focus();
            }
        }
    }
}
