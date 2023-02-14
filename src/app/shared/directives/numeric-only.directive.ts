import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[numericOnly]'
})

export class NumericOnlyDirective  {
    @Input() OnlyNumber: boolean;
    private regex: RegExp = new RegExp('^[0-9]*$')
    private specialKeys: Array<string> = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Alt', 'Tab']
    constructor(private el: ElementRef) { }

  
    @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
        const inputValue: string = this.el.nativeElement.value.concat(event.key)
        if(this.specialKeys.indexOf(event.key) !== -1){
            return;
        }
        if(inputValue && !String(inputValue).match(this.regex)){
            event.preventDefault();
        }
        return;
    }
}